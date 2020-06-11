/* eslint-disable max-len */
/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
// import GFMDataProcessor from '@ckeditor/ckeditor5-markdown-gfm/src/gfmdataprocessor';

// Simple plugin which loads the data processor.
// function Markdown( editor ) {
// 	editor.data.processor = new GFMDataProcessor( editor.editing.view.document );
// }

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	Underline,
	Strikethrough,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	ImageResize,
	Indent,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation
];

// Editor configuration.
ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'|',
			'indent',
			'outdent',
			'|',
			'ckfinder',
			'|',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
			'undo',
			'redo'
		]
	},
	ckfinder: {
		openerMethod: 'popup'
	},
	image: {
		styles: [
			'full',
			'side',
			'alignLeft',
			'alignRight'
		],
		toolbar: [
			'imageStyle:side',
			'imageStyle:alignLeft',
			'imageStyle:full',
			'imageStyle:alignRight',
			'|',
			'imageTextAlternative'
		]
	},
	mediaEmbed: {
		extraProviders: [
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
						'<div class="embed-bandcamp" style="position: relative; width: 100%; padding-bottom: 30%; height: 0; padding-top: 80px;">' +
							`<iframe src="https://bandcamp.com/EmbeddedPlayer/album=${ id }/size=large/bgcol=ffffff/linkcol=333333/artwork=small/" ` +
								'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
								'frameborder="0" allow="encrypted-media">' +
							'</iframe>' +
						'</div>'
					);
				}
			}
			// {
			// 	name: 'soundcloud',
			// 	url: [
			// 		/^soundcloud.com\/(\w+)\/(\w+)/
			// 	],
			// 	html: match => {
			// 		const id = match[ 1 ];

			// 		return (
			// 			'<div class="embed-soundcloud" style="position: relative; width: 100%; padding-bottom: 30%; height: 0; padding-top: 80px;">' +
			// 				`<iframe src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/115003565128"${ id }"` +
			// 					'style="border: 0; width: 100%; height: 166px;"' +
			// 					'allowfullscreen allow="encrypted-media">' +
			// 				'</iframe>' +
			// 			'</div>'
			// 		);
			// 	}
			// }
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	language: 'en'
};
