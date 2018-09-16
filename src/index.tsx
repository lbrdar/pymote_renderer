import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { JSONObject } from '@phosphor/coreutils';
import { Widget } from '@phosphor/widgets';
import * as ReactDOM from 'react-dom';
import * as  React from 'react';
import Root from './components/Root';
import '../style/index.css';

/**
 * The default mime type for the extension.
 */
const MIME_TYPE = 'application/pymote';

/**
 * The class name added to the extension.
 */
const CLASS_NAME = 'mimerenderer-pymote';

/**
 * A widget for rendering pymote.
 */
export class OutputWidget extends Widget implements IRenderMime.IRenderer {
  /**
   * Construct a new output widget.
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
    this.addClass(CLASS_NAME);
    this.node.appendChild(document.createElement('div'));
  }

  /**
   * Render pymote into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    console.log('Called this fancy function');
    const data = model.data[this._mimeType] as JSONObject;
    const host = this.node.firstChild as Element;
    ReactDOM.render(<Root results={data} />, host);
    return Promise.resolve();
  }

  private _mimeType: string;
}

/**
 * A mime renderer factory for pymote data.
 */
export const rendererFactory: IRenderMime.IRendererFactory = {
  safe: true,
  mimeTypes: [MIME_TYPE],
  createRenderer: options => new OutputWidget(options)
};

/**
 * Extension definition.
 */
const extension: IRenderMime.IExtension = {
  id: 'pymote_renderer:plugin',
  rendererFactory,
  rank: 0,
  dataType: 'json',
  fileTypes: [
    {
      name: 'pymote',
      mimeTypes: [MIME_TYPE],
      extensions: ['.pymote']
    }
  ],
  documentWidgetFactoryOptions: {
    name: 'PymoteViewer',
    primaryFileType: 'pymote',
    fileTypes: ['pymote'],
    defaultFor: ['pymote']
  }
};

export default extension;
