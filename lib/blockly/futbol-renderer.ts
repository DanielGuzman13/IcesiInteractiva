import * as Blockly from 'blockly';

const FUTBOL_RENDERER_NAME = 'futbol_zelos_openings';

type TunedConstants = Pick<
  Blockly.zelos.ConstantProvider,
  | 'NOTCH_WIDTH'
  | 'NOTCH_HEIGHT'
  | 'TAB_WIDTH'
  | 'TAB_HEIGHT'
  | 'STATEMENT_INPUT_PADDING_LEFT'
  | 'STATEMENT_INPUT_SPACER_MIN_WIDTH'
>;

class FutbolConstantProvider extends Blockly.zelos.ConstantProvider {
  constructor() {
    super();
  }
}

class FutbolRenderer extends Blockly.zelos.Renderer {
  private repeatTuningSnapshot: TunedConstants | null = null;

  protected override makeConstants_() {
    return new FutbolConstantProvider();
  }

  protected override makeRenderInfo_(block: Blockly.BlockSvg) {
    return new FutbolRenderInfo(this, block);
  }

  enableRepeatTuning() {
    if (this.repeatTuningSnapshot) {
      return;
    }

    const constants = this.getConstants() as Blockly.zelos.ConstantProvider;
    this.repeatTuningSnapshot = {
      NOTCH_WIDTH: constants.NOTCH_WIDTH,
      NOTCH_HEIGHT: constants.NOTCH_HEIGHT,
      TAB_WIDTH: constants.TAB_WIDTH,
      TAB_HEIGHT: constants.TAB_HEIGHT,
      STATEMENT_INPUT_PADDING_LEFT: constants.STATEMENT_INPUT_PADDING_LEFT,
      STATEMENT_INPUT_SPACER_MIN_WIDTH: constants.STATEMENT_INPUT_SPACER_MIN_WIDTH,
    };

    constants.NOTCH_WIDTH = 30;
    constants.NOTCH_HEIGHT = 10;
    constants.TAB_WIDTH = 16;
    constants.TAB_HEIGHT = 24;
    constants.STATEMENT_INPUT_PADDING_LEFT = 28;
    constants.STATEMENT_INPUT_SPACER_MIN_WIDTH = 28;
  }

  disableRepeatTuning() {
    if (!this.repeatTuningSnapshot) {
      return;
    }

    const constants = this.getConstants() as Blockly.zelos.ConstantProvider;
    const snapshot = this.repeatTuningSnapshot;

    constants.NOTCH_WIDTH = snapshot.NOTCH_WIDTH;
    constants.NOTCH_HEIGHT = snapshot.NOTCH_HEIGHT;
    constants.TAB_WIDTH = snapshot.TAB_WIDTH;
    constants.TAB_HEIGHT = snapshot.TAB_HEIGHT;
    constants.STATEMENT_INPUT_PADDING_LEFT = snapshot.STATEMENT_INPUT_PADDING_LEFT;
    constants.STATEMENT_INPUT_SPACER_MIN_WIDTH = snapshot.STATEMENT_INPUT_SPACER_MIN_WIDTH;

    this.repeatTuningSnapshot = null;
  }
}

class FutbolRenderInfo extends Blockly.zelos.RenderInfo {
  public override measure() {
    const renderer = this.getRenderer() as FutbolRenderer;

    if (this.block_.type === 'futbol_repetir_4') {
      renderer.enableRepeatTuning();

      try {
        super.measure();
      } finally {
        renderer.disableRepeatTuning();
      }

      return;
    }

    super.measure();
  }
}

export function registerFutbolRenderer() {
  try {
    Blockly.blockRendering.unregister(FUTBOL_RENDERER_NAME);
  } catch {
    // No-op: may not be registered yet.
  }

  Blockly.blockRendering.register(FUTBOL_RENDERER_NAME, FutbolRenderer);

  return FUTBOL_RENDERER_NAME;
}
