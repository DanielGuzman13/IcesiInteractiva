const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuración por defecto de PostgreSQL
const DEFAULT_CONFIG = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres' // Conectar a postgres por defecto para crear la nueva DB
};

async function setupDatabase() {
  console.log('🚀 Iniciando configuración de base de datos...\n');

  // Leer configuración desde argumentos o usar defaults
  const args = process.argv.slice(2);
  const password = args[0] || DEFAULT_CONFIG.password;
  const user = args[1] || DEFAULT_CONFIG.user;
  const host = args[2] || DEFAULT_CONFIG.host;
  const port = parseInt(args[3]) || DEFAULT_CONFIG.port;

  const config = { ...DEFAULT_CONFIG, password, user, host, port };

  console.log('📋 Configuración de conexión:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Puerto: ${config.port}`);
  console.log(`   Usuario: ${config.user}`);
  console.log(`   Contraseña: ${'*'.repeat(password.length)}\n`);

  let pool;

  try {
    // 1. Conectar a PostgreSQL
    console.log('🔌 Conectando a PostgreSQL...');
    pool = new Pool(config);
    
    try {
      await pool.query('SELECT NOW()');
      console.log('✅ Conexión exitosa a PostgreSQL\n');
    } catch (error) {
      console.error('❌ Error al conectar a PostgreSQL:');
      console.error('   Asegúrate de que PostgreSQL esté ejecutándose');
      console.error('   Verifica que el usuario y contraseña sean correctos');
      console.error(`   Error: ${error.message}\n`);
      process.exit(1);
    }

    // 2. Crear base de datos si no existe
    console.log('📦 Verificando base de datos icesi_interactiva...');
    try {
      await pool.query('CREATE DATABASE icesi_interactiva');
      console.log('✅ Base de datos creada\n');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  La base de datos ya existe\n');
      } else {
        throw error;
      }
    }

    // 3. Cerrar conexión actual y conectar a la nueva base de datos
    await pool.end();
    console.log('🔌 Conectando a la base de datos icesi_interactiva...');
    pool = new Pool({ ...config, database: 'icesi_interactiva' });
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión exitosa a icesi_interactiva\n');

    // 4. Ejutar schema.sql
    console.log('📄 Ejecutando schema.sql...');
    const schemaPath = path.join(__dirname, 'lib', 'database', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ No se encontró el archivo schema.sql');
      console.error(`   Ruta esperada: ${schemaPath}\n`);
      process.exit(1);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log('✅ Schema ejecutado exitosamente\n');

    // 5. Crear archivo .env.local
    console.log('⚙️  Creando archivo .env.local...');
    const envPath = path.join(__dirname, '.env.local');
    const connectionString = `postgresql://${user}:${password}@${host}:${port}/icesi_interactiva`;
    
    fs.writeFileSync(envPath, `DATABASE_URL=${connectionString}\n`);
    console.log('✅ Archivo .env.local creado\n');

    // 6. Cerrar conexión
    await pool.end();
    console.log('🎉 Configuración completada exitosamente!\n');
    console.log('📝 Siguientes pasos:');
    console.log('   1. Ejecuta: npm install');
    console.log('   2. Ejecuta: npm run build');
    console.log('   3. Ejecuta: npm start');
    console.log('\n💡 Para iniciar en modo desarrollo usa: npm run dev\n');

  } catch (error) {
    console.error('❌ Error durante la configuración:');
    console.error(error.message);
    
    if (pool) {
      await pool.end();
    }
    
    process.exit(1);
  }
}

// Ejecutar setup
setupDatabase();
