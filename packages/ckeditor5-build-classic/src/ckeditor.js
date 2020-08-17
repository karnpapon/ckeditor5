/* eslint-disable max-len */
/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import MediaToolbar from '@ckeditor/ckeditor5-media-embed/src/mediaembedtoolbar';
import MediaStyle from '@kimnagui/ckeditor5-media-align';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import { createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import MediaFormView from '@ckeditor/ckeditor5-media-embed/src/ui/mediaformview';
import Embed from 'ckeditor5-embed/src/embed';

class InsertImage extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'insertImage', locale => {
			const dropdown = createDropdown( locale );
			const mediaForm = new MediaFormView( getFormValidators( editor.t ), editor.locale );

			this._setUpDropdown( dropdown, mediaForm, editor );
			this._setUpForm( dropdown, mediaForm );

			return dropdown;
		} );
	}
	_setUpDropdown( dropdown, form ) {
		const editor = this.editor;
		const t = editor.t;
		const button = dropdown.buttonView;
		dropdown.panelView.children.add( form );

		button.set( {
			label: t( 'Insert image' ),
			icon: imageIcon,
			tooltip: true
		} );

		button.on( 'open', () => {
			form.url = '';
			form.urlInputView.fieldView.select();
			form.focus();
		}, { priority: 'low' } );

		dropdown.on( 'submit', () => {
			if ( form.isValid() ) {
				editor.model.change( writer => {
					const imageElement = writer.createElement( 'image', {
						src: form.url
					} );
					editor.model.insertContent( imageElement, editor.model.document.selection );
				} );
				closeUI();
			}
		} );

		dropdown.on( 'change:isOpen', () => form.resetFormStatus() );
		dropdown.on( 'cancel', () => closeUI() );

		function closeUI() {
			editor.editing.view.focus();
			dropdown.isOpen = false;
		}
	}
	_setUpForm( dropdown, form ) {
		form.delegate( 'submit', 'cancel' ).to( dropdown );
	}
}

function getFormValidators( t ) {
	return [
		form => {
			if ( !form.url.length ) {
				return t( 'The URL must not be empty.' );
			}
		}
	];
}

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	Alignment,
	Autoformat,
	Bold,
	Italic,
	Underline,
	Strikethrough,
	BlockQuote,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageResize,
	Indent,
	Link,
	List,
	Embed,
	MediaEmbed,
	MediaToolbar,
	MediaStyle,
	InsertImage,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation
];

// Editor configuration.
// ClassicEditor.defaultConfig = {
// 	toolbar: {
// 		items: [
// 			'heading',
// 			'|',
// 			'bold',
// 			'italic',
// 			'link',
// 			'bulletedList',
// 			'numberedList',
// 			'imageUpload',
// 			'embed',
// 			'blockQuote',
// 			'undo',
// 			'redo'
// 		]
// 	},
// 	image: {
// 		toolbar: [
// 			'imageStyle:full',
// 			'imageStyle:side',
// 			'|',
// 			'imageTextAlternative'
// 		]
// 	},
// 	embed: {
// 		allowAttributes: [ 'frameborder', 'allow' ],
// 		getEmbedAttributes: userSrc => {
// 			const regex = /<iframe.*?src="(.*?)"/;
// 			const srcFull = regex.exec( userSrc );
// 			const src = srcFull[ 1 ];
// 			const _src = src;
// 			return {
// 				src: _src
// 			};
// 		},
// 		enablePlayerInEditor: true
// 	},
// 	language: 'en'
// };

// Editor configuration.
// ClassicEditor.defaultConfig = {
// 	toolbar: {
// 		items: [
// 			'heading',
// 			'|',
// 			'alignment',
// 			'|',
// 			'bold',
// 			'italic',
// 			'link',
// 			'underline',
// 			'strikethrough',
// 			'bulletedList',
// 			'numberedList',
// 			'|',
// 			'indent',
// 			'outdent',
// 			'|',
// 			'insertImage',
// 			'mediaEmbed',
// 			'|',
// 			'blockQuote',
// 			'insertTable',
// 			'undo',
// 			'redo'
// 		]
// 	},
// 	alignment: {
// 		options: [ 'left', 'right', 'center', 'justify' ]
// 	},
// 	image: {
// 		styles: [
// 			'full',
// 			'side',
// 			'alignLeft',
// 			'alignRight'
// 		],
// 		toolbar: [
// 			'imageStyle:side',
// 			'imageStyle:alignLeft',
// 			'imageStyle:full',
// 			'imageStyle:alignRight',
// 			'|',
// 			'imageTextAlternative'
// 		]
// 	},
// 	mediaEmbed: {
// 		previewsInData: true,
// 		toolbar: [
// 			'mediaStyle:full',
// 			'|',
// 			'mediaStyle:alignLeft',
// 			'mediaStyle:alignCenter',
// 			'mediaStyle:alignRight'
// 		],
// 		styles: [ 'full', 'alignLeft', 'alignCenter', 'alignRight' ],
// 		providers: [
// 			{
// 				name: 'bandcamp',
// 				url: [
// 					/^(\w+)\.bandcamp\.com/,
// 					/^(\w+)\.bandcamp\.com\/(album)\/([\w-]+)/,
// 					/^(\w+)\.bandcamp\.com\/(track)\/([\w-]+)/
// 				],
// 				html: match => {
// 					const id = match[ 1 ];
// 					return (
// 						'<div class="embed-bandcamp" style="position: relative; width: 100%; padding-bottom: 30%; height: 0; padding-top: 20px;">' +
// 							`<iframe src="https://bandcamp.com/EmbeddedPlayer/album=${ id }/size=large/bgcol=ffffff/linkcol=333333/artwork=small/" ` +
// 								'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
// 								'frameborder="0" allow="encrypted-media">' +
// 							'</iframe>' +
// 						'</div>'
// 					);
// 				}
// 			},
// 			{
// 				name: 'soundcloud',
// 				url: [
// 					/^soundcloud.com\/(\w+)\/([\w-]+)\/([\w-]+)/,
// 					/^soundcloud.com\/(tracks)\/(\w+)/,
// 					/^soundcloud.com\/(playlists)\/(\w+)/,
// 					/^soundcloud.com\/(users)\/(\w+)/
// 				],
// 				html: match => {
// 					const type = match[ 1 ];
// 					const id = match[ 2 ];
// 					const k = match[ 3 ];

// 					const token = k !== undefined ? `&secret_token=${ k }` : '';

// 					return (
// 						`<div class="embed-soundcloud" style="position: relative; width: 100%; padding-bottom: ${ type === 'tracks' ? '21.5%' : '40%' } height: 0;">` +
// 							`<iframe src="https://w.soundcloud.com/player/?visual=false&url=https://api.soundcloud.com/${ type }/${ id }&show_artwork=true${ token }"` +
// 								`style="border: 0; width: 100%; height: ${ type === 'tracks' ? '166px' : '300px' };"` +
// 								'allowfullscreen allow="encrypted-media">' +
// 							'</iframe>' +
// 						'</div>'
// 					);
// 				}
// 			},
// 			{
// 				name: 'facebook',
// 				url: [
// 					/^facebook.com\/(\w+)\/videos\/([^&$]+)/
// 				],
// 				html: match => {
// 					// const username = match[ 1 ];
// 					const id = match[ 2 ];
// 					const test = `https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F${ id }%2F`;
// 					return (
// 						'<div class="embed-facebook" style="position: relative; overflow: hidden; width: 100%; padding-bottom: 56.2%; height: 0;">' +
// 							`<iframe src="https://www.facebook.com/plugins/video.php?href=${ test }&show_text=0&width=560"` +
// 								'style="border: 0; width: 100%; height: 400px;" ' +
// 								'allowfullscreen allow="encrypted-media">' +
// 							'</iframe>' +
// 						'</div>'
// 					);
// 				}
// 			}
// 		]
// 	},
// 	table: {
// 		contentToolbar: [
// 			'tableColumn',
// 			'tableRow',
// 			'mergeTableCells'
// 		]
// 	},
// 	language: 'en'
// };
