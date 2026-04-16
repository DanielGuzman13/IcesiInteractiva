import { UserAnswer, CreateUserAnswerInput } from '../models/UserAnswer';
import { BaseRepository } from './UserRepository';
import { getPostgresPool } from '../lib/database/postgres';

interface UserAnswerRow {
  id: string;
  user_id: string;
  challenge_id: string;
  play_step_id: string;
  answer: unknown;
  is_correct: boolean;
  response_time: number;
  attempts: number;
  score: number;
  answered_at: Date;
}

const hasDatabaseConfig = (): boolean => Boolean(process.env.DATABASE_URL);

const globalForAnswerRepo = globalThis as typeof globalThis & {
  __icesiAnswersById?: Map<string, UserAnswer>;
};

const inMemoryAnswersById = globalForAnswerRepo.__icesiAnswersById ?? new Map<string, UserAnswer>();

if (process.env.NODE_ENV !== 'production') {
  globalForAnswerRepo.__icesiAnswersById = inMemoryAnswersById;
}

const mapUserAnswer = (row: UserAnswerRow): UserAnswer => ({
  id: row.id,
  userId: row.user_id,
  challengeId: row.challenge_id,
  playStepId: row.play_step_id,
  answer: row.answer,
  isCorrect: row.is_correct,
  responseTime: row.response_time,
  attempts: row.attempts,
  score: row.score,
  answeredAt: row.answered_at,
});

export class UserAnswerRepository extends BaseRepository<UserAnswer> {
  async create(answerData: CreateUserAnswerInput): Promise<UserAnswer> {
    if (!hasDatabaseConfig()) {
      const answer: UserAnswer = {
        id: crypto.randomUUID(),
        userId: answerData.userId,
        challengeId: answerData.challengeId,
        playStepId: answerData.playStepId,
        answer: answerData.answer,
        isCorrect: answerData.isCorrect,
        responseTime: answerData.responseTime,
        attempts: answerData.attempts,
        score: answerData.score,
        answeredAt: new Date(),
      };
      inMemoryAnswersById.set(answer.id, answer);
      return answer;
    }

    const pool = getPostgresPool();

    // Build query dynamically: omit play_step_id if null to avoid NOT NULL constraint on existing DBs
    const hasPlayStep = answerData.playStepId != null;
    const columns = hasPlayStep
      ? 'user_id, challenge_id, play_step_id, answer, is_correct, response_time, attempts, score'
      : 'user_id, challenge_id, answer, is_correct, response_time, attempts, score';
    const placeholders = hasPlayStep ? '$1, $2, $3, $4, $5, $6, $7, $8' : '$1, $2, $3, $4, $5, $6, $7';
    const values = hasPlayStep
      ? [answerData.userId, answerData.challengeId, answerData.playStepId, JSON.stringify(answerData.answer), answerData.isCorrect, answerData.responseTime, answerData.attempts, answerData.score]
      : [answerData.userId, answerData.challengeId, JSON.stringify(answerData.answer), answerData.isCorrect, answerData.responseTime, answerData.attempts, answerData.score];

    const result = await pool.query<UserAnswerRow>(
      `
        INSERT INTO user_answers (${columns})
        VALUES (${placeholders})
        RETURNING id, user_id, challenge_id, play_step_id, answer, is_correct, response_time, attempts, score, answered_at
      `,
      values
    );

    return mapUserAnswer(result.rows[0]);
  }

  async findById(id: string): Promise<UserAnswer | null> {
    if (!hasDatabaseConfig()) {
      return inMemoryAnswersById.get(id) ?? null;
    }

    const pool = getPostgresPool();
    const result = await pool.query<UserAnswerRow>(
      `
        SELECT id, user_id, challenge_id, play_step_id, answer, is_correct, response_time, attempts, score, answered_at
        FROM user_answers
        WHERE id = $1
        LIMIT 1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return mapUserAnswer(result.rows[0]);
  }

  async update(id: string, data: Partial<UserAnswer>): Promise<UserAnswer> {
    if (!hasDatabaseConfig()) {
      const existing = inMemoryAnswersById.get(id);
      if (!existing) throw new Error('Respuesta de usuario no encontrada');
      
      const updated: UserAnswer = {
        ...existing,
        answer: data.answer !== undefined ? data.answer : existing.answer,
        isCorrect: typeof data.isCorrect === 'boolean' ? data.isCorrect : existing.isCorrect,
        responseTime: typeof data.responseTime === 'number' ? data.responseTime : existing.responseTime,
        attempts: typeof data.attempts === 'number' ? data.attempts : existing.attempts,
        score: typeof data.score === 'number' ? data.score : existing.score,
      };
      
      inMemoryAnswersById.set(id, updated);
      return updated;
    }

    const pool = getPostgresPool();
    const updates: string[] = [];
    const values: Array<string | number | boolean | unknown> = [];

    if (data.answer !== undefined) {
      values.push(JSON.stringify(data.answer));
      updates.push(`answer = $${values.length}`);
    }

    if (typeof data.isCorrect === 'boolean') {
      values.push(data.isCorrect);
      updates.push(`is_correct = $${values.length}`);
    }

    if (typeof data.responseTime === 'number') {
      values.push(data.responseTime);
      updates.push(`response_time = $${values.length}`);
    }

    if (typeof data.attempts === 'number') {
      values.push(data.attempts);
      updates.push(`attempts = $${values.length}`);
    }

    if (typeof data.score === 'number') {
      values.push(data.score);
      updates.push(`score = $${values.length}`);
    }

    if (updates.length === 0) {
      const existingAnswer = await this.findById(id);
      if (!existingAnswer) {
        throw new Error('Respuesta de usuario no encontrada');
      }
      return existingAnswer;
    }

    values.push(id);

    const result = await pool.query<UserAnswerRow>(
      `
        UPDATE user_answers
        SET ${updates.join(', ')}
        WHERE id = $${values.length}
        RETURNING id, user_id, challenge_id, play_step_id, answer, is_correct, response_time, attempts, score, answered_at
      `,
      values
    );

    if (result.rowCount === 0) {
      throw new Error('Respuesta de usuario no encontrada');
    }

    return mapUserAnswer(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    if (!hasDatabaseConfig()) {
      return inMemoryAnswersById.delete(id);
    }

    const pool = getPostgresPool();
    const result = await pool.query('DELETE FROM user_answers WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async findAll(filters?: Partial<UserAnswer>): Promise<UserAnswer[]> {
    if (!hasDatabaseConfig()) {
      let answers = Array.from(inMemoryAnswersById.values());
      if (filters?.userId) answers = answers.filter(a => a.userId === filters.userId);
      if (filters?.challengeId) answers = answers.filter(a => a.challengeId === filters.challengeId);
      if (filters?.playStepId) answers = answers.filter(a => a.playStepId === filters.playStepId);
      if (typeof filters?.isCorrect === 'boolean') answers = answers.filter(a => a.isCorrect === filters.isCorrect);
      return answers.sort((a, b) => b.answeredAt.getTime() - a.answeredAt.getTime());
    }

    const pool = getPostgresPool();
    const conditions: string[] = [];
    const values: Array<string | number | boolean> = [];

    if (filters?.userId) {
      values.push(filters.userId);
      conditions.push(`user_id = $${values.length}`);
    }

    if (filters?.challengeId) {
      values.push(filters.challengeId);
      conditions.push(`challenge_id = $${values.length}`);
    }

    if (filters?.playStepId) {
      values.push(filters.playStepId);
      conditions.push(`play_step_id = $${values.length}`);
    }

    if (typeof filters?.isCorrect === 'boolean') {
      values.push(filters.isCorrect);
      conditions.push(`is_correct = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query<UserAnswerRow>(
      `
        SELECT id, user_id, challenge_id, play_step_id, answer, is_correct, response_time, attempts, score, answered_at
        FROM user_answers
        ${whereClause}
        ORDER BY answered_at DESC
      `,
      values
    );

    return result.rows.map(mapUserAnswer);
  }

  // Métodos específicos
  async findByUserId(userId: string): Promise<UserAnswer[]> {
    if (!hasDatabaseConfig()) {
      return Array.from(inMemoryAnswersById.values())
        .filter(a => a.userId === userId)
        .sort((a, b) => b.answeredAt.getTime() - a.answeredAt.getTime());
    }

    const pool = getPostgresPool();
    const result = await pool.query<UserAnswerRow>(
      `
        SELECT id, user_id, challenge_id, play_step_id, answer, is_correct, response_time, attempts, score, answered_at
        FROM user_answers
        WHERE user_id = $1
        ORDER BY answered_at DESC
      `,
      [userId]
    );

    return result.rows.map(mapUserAnswer);
  }

  async findByChallengeId(challengeId: string): Promise<UserAnswer[]> {
    if (!hasDatabaseConfig()) {
      return Array.from(inMemoryAnswersById.values())
        .filter(a => a.challengeId === challengeId)
        .sort((a, b) => b.answeredAt.getTime() - a.answeredAt.getTime());
    }

    const pool = getPostgresPool();
    const result = await pool.query<UserAnswerRow>(
      `
        SELECT id, user_id, challenge_id, play_step_id, answer, is_correct, response_time, attempts, score, answered_at
        FROM user_answers
        WHERE challenge_id = $1
        ORDER BY answered_at DESC
      `,
      [challengeId]
    );

    return result.rows.map(mapUserAnswer);
  }

  async getUserStats(userId: string): Promise<{
    totalAnswers: number;
    correctAnswers: number;
    averageResponseTime: number;
    totalScore: number;
  }> {
    if (!hasDatabaseConfig()) {
      const answers = Array.from(inMemoryAnswersById.values()).filter(a => a.userId === userId);
      const totalAnswers = answers.length;
      const correctAnswers = answers.filter(a => a.isCorrect).length;
      const totalScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
      const sumTime = answers.reduce((sum, a) => sum + (a.responseTime || 0), 0);
      const averageResponseTime = totalAnswers > 0 ? sumTime / totalAnswers : 0;

      return { totalAnswers, correctAnswers, averageResponseTime, totalScore };
    }

    const pool = getPostgresPool();
    const result = await pool.query(
      `
        SELECT
          COUNT(*) as total_answers,
          SUM(CASE WHEN is_correct = TRUE THEN 1 ELSE 0 END) as correct_answers,
          AVG(response_time) as average_response_time,
          SUM(score) as total_score
        FROM user_answers
        WHERE user_id = $1
      `,
      [userId]
    );

    const row = result.rows[0];
    return {
      totalAnswers: parseInt(row.total_answers),
      correctAnswers: parseInt(row.correct_answers),
      averageResponseTime: parseFloat(row.average_response_time) || 0,
      totalScore: parseInt(row.total_score) || 0,
    };
  }
}
