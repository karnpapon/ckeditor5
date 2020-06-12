/* eslint-disable max-len */
/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module media-embed/mediaembedediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { modelToViewUrlAttributeConverter } from './converters';
import MediaEmbedCommand from './mediaembedcommand';
import MediaRegistry from './mediaregistry';
import { toMediaWidget, createMediaFigureElement } from './utils';

import '../theme/mediaembedediting.css';

/**
 * The media embed editing feature.
 *
 * @extends module:core/plugin~Plugin
 */
export default class MediaEmbedEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'MediaEmbedEditing';
	}

	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );

		editor.config.define( 'mediaEmbed', {
			providers: [
				{
					name: 'dailymotion',
					url: /^dailymotion\.com\/video\/(\w+)/,
					html: match => {
						const id = match[ 1 ];

						return (
							'<div style="position: relative; padding-bottom: 100%; height: 0; ">' +
								`<iframe src="https://www.dailymotion.com/embed/video/${ id }" ` +
									'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
									'frameborder="0" width="480" height="270" allowfullscreen allow="autoplay">' +
								'</iframe>' +
							'</div>'
						);
					}
				},

				{
					name: 'spotify',
					url: [
						/^open\.spotify\.com\/(artist\/\w+)/,
						/^open\.spotify\.com\/(album\/\w+)/,
						/^open\.spotify\.com\/(track\/\w+)/
						// /^open\.spotify\.com\/(\w+\/\w+)\/(width=[0-9]{2})/
					],
					html: match => {
						const id = match[ 1 ];

						return (
							'<div class="embed-spotify" style="position: relative;  width: 100% ; padding-top: 0; height: 0; padding-bottom: 30% ;">' +
								`<iframe src="https://open.spotify.com/embed/${ id }" ` +
									'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
									'frameborder="0" allowtransparency="true" allow="encrypted-media">' +
								'</iframe>' +
							'</div>'
						);
					}
				},

				{
					name: 'youtube',
					url: [
						/^(?:m\.)?youtube\.com\/watch\?v=([\w-]+)/,
						/^(?:m\.)?youtube\.com\/v\/([\w-]+)/,
						/^youtube\.com\/embed\/([\w-]+)/,
						/^youtu\.be\/([\w-]+)/
					],
					html: match => {
						const id = match[ 1 ];

						return (
							'<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
								`<iframe src="https://www.youtube.com/embed/${ id }" ` +
									'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
									'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
								'</iframe>' +
							'</div>'
						);
					}
				},

				{
					name: 'vimeo',
					url: [
						/^vimeo\.com\/(\d+)/,
						/^vimeo\.com\/[^/]+\/[^/]+\/video\/(\d+)/,
						/^vimeo\.com\/album\/[^/]+\/video\/(\d+)/,
						/^vimeo\.com\/channels\/[^/]+\/(\d+)/,
						/^vimeo\.com\/groups\/[^/]+\/videos\/(\d+)/,
						/^vimeo\.com\/ondemand\/[^/]+\/(\d+)/,
						/^player\.vimeo\.com\/video\/(\d+)/
					],
					html: match => {
						const id = match[ 1 ];

						return (
							'<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
								`<iframe src="https://player.vimeo.com/video/${ id }" ` +
									'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
									'frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>' +
								'</iframe>' +
							'</div>'
						);
					}
				},
				{
					name: 'bandcamp',
					url: [
						/^(\w+)\.bandcamp\.com/,
						/^(\w+)\.bandcamp\.com\/(album)\/([\w-]+)/,
						/^(\w+)\.bandcamp\.com\/(track)\/([\w-]+)/
					],
					html: match => {
						const id = match[ 1 ];
						return (
							'<div class="embed-bandcamp" style="position: relative; width: 100%; padding-bottom: 30%; height: 0; padding-top: 20px;">' +
								`<iframe src="https://bandcamp.com/EmbeddedPlayer/album=${ id }/size=large/bgcol=ffffff/linkcol=333333/artwork=small/" ` +
									'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
									'frameborder="0" allow="encrypted-media">' +
								'</iframe>' +
							'</div>'
						);
					}
				},
				{
					name: 'soundcloud',
					url: [
						/^soundcloud.com\/(tracks)\/(\w+)/,
						/^soundcloud.com\/(playlists)\/(\w+)/
					],
					html: match => {
						const type = match[ 1 ];
						const id = match[ 2 ];
						return (
							`<div class="embed-soundcloud" style="position: relative; width: 100%; padding-bottom: ${ type === 'tracks' ? '21.5%' : '40%' } height: 0;">` +
								`<iframe src="https://w.soundcloud.com/player/?visual=false&url=https://api.soundcloud.com/${ type }/${ id }&show_artwork=true"` +
									`style="border: 0; width: 100%; height: ${ type === 'tracks' ? '166px' : '300px' };"` +
									'allowfullscreen allow="encrypted-media">' +
								'</iframe>' +
							'</div>'
						);
					}
				},
				{
					name: 'facebook',
					url: [
						/^facebook.com\/(\w+)\/videos\/([^&$]+)/
					],
					html: match => {
						// const username = match[ 1 ];
						const id = match[ 2 ];
						const test = `https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F${ id }%2F`;
						return (
							'<div class="embed-facebook" style="position: relative; overflow: hidden; width: 100%; padding-bottom: 56.2%; height: 0;">' +
								`<iframe src="https://www.facebook.com/plugins/video.php?href=${ test }&show_text=0&width=560"` +
									'style="border: 0; width: 100%; height: 400px;" ' +
									'allowfullscreen allow="encrypted-media">' +
								'</iframe>' +
							'</div>'
						);
					}
				},
				{
					name: 'instagram',
					url: /^instagram\.com\/p\/(\w+)/
				},
				{
					name: 'twitter',
					url: /^twitter\.com/
				},
				{
					name: 'googleMaps',
					url: /^google\.com\/maps/
				},
				{
					name: 'flickr',
					url: /^flickr\.com/
				}
			]
		} );

		/**
		 * The media registry managing the media providers in the editor.
		 *
		 * @member {module:media-embed/mediaregistry~MediaRegistry} #registry
		 */
		this.registry = new MediaRegistry( editor.locale, editor.config.get( 'mediaEmbed' ) );
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const t = editor.t;
		const conversion = editor.conversion;
		const renderMediaPreview = editor.config.get( 'mediaEmbed.previewsInData' );
		const registry = this.registry;

		editor.commands.add( 'mediaEmbed', new MediaEmbedCommand( editor ) );

		// Configure the schema.
		schema.register( 'media', {
			isObject: true,
			isBlock: true,
			allowWhere: '$block',
			allowAttributes: [ 'url' ]
		} );

		// Model -> Data
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'media',
			view: ( modelElement, viewWriter ) => {
				const url = modelElement.getAttribute( 'url' );

				return createMediaFigureElement( viewWriter, registry, url, {
					renderMediaPreview: url && renderMediaPreview
				} );
			}
		} );

		// Model -> Data (url -> data-oembed-url)
		conversion.for( 'dataDowncast' ).add(
			modelToViewUrlAttributeConverter( registry, {
				renderMediaPreview
			} ) );

		// Model -> View (element)
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'media',
			view: ( modelElement, viewWriter ) => {
				const url = modelElement.getAttribute( 'url' );
				const figure = createMediaFigureElement( viewWriter, registry, url, {
					renderForEditingView: true
				} );

				return toMediaWidget( figure, viewWriter, t( 'media widget' ) );
			}
		} );

		// Model -> View (url -> data-oembed-url)
		conversion.for( 'editingDowncast' ).add(
			modelToViewUrlAttributeConverter( registry, {
				renderForEditingView: true
			} ) );

		// View -> Model (data-oembed-url -> url)
		conversion.for( 'upcast' )
			// Upcast semantic media.
			.elementToElement( {
				view: {
					name: 'oembed',
					attributes: {
						url: true
					}
				},
				model: ( viewMedia, modelWriter ) => {
					const url = viewMedia.getAttribute( 'url' );

					if ( registry.hasMedia( url ) ) {
						return modelWriter.createElement( 'media', { url } );
					}
				}
			} )
			// Upcast non-semantic media.
			.elementToElement( {
				view: {
					name: 'div',
					attributes: {
						'data-oembed-url': true
					}
				},
				model: ( viewMedia, modelWriter ) => {
					const url = viewMedia.getAttribute( 'data-oembed-url' );

					if ( registry.hasMedia( url ) ) {
						return modelWriter.createElement( 'media', { url } );
					}
				}
			} );
	}
}
