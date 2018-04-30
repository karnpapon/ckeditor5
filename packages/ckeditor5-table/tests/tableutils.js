/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import ModelTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/modeltesteditor';
import { setData, getData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';
import { upcastElementToElement } from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';

import { downcastInsertTable } from '../src/converters/downcast';
import upcastTable from '../src/converters/upcasttable';
import { formatTable, formattedModelTable, modelTable } from './_utils/utils';
import TableUtils from '../src/tableutils';

describe( 'TableUtils', () => {
	let editor, model, root, tableUtils;

	beforeEach( () => {
		return ModelTestEditor.create( {
			plugins: [ TableUtils ]
		} ).then( newEditor => {
			editor = newEditor;
			model = editor.model;
			root = model.document.getRoot( 'main' );
			tableUtils = editor.plugins.get( TableUtils );

			const conversion = editor.conversion;
			const schema = model.schema;

			schema.register( 'table', {
				allowWhere: '$block',
				allowAttributes: [ 'headingRows' ],
				isBlock: true,
				isObject: true
			} );

			schema.register( 'tableRow', {
				allowIn: 'table',
				allowAttributes: [],
				isBlock: true,
				isLimit: true
			} );

			schema.register( 'tableCell', {
				allowIn: 'tableRow',
				allowContentOf: '$block',
				allowAttributes: [ 'colspan', 'rowspan' ],
				isBlock: true,
				isLimit: true
			} );

			model.schema.register( 'p', { inheritAllFrom: '$block' } );

			// Table conversion.
			conversion.for( 'upcast' ).add( upcastTable() );
			conversion.for( 'downcast' ).add( downcastInsertTable() );

			// Table row upcast only since downcast conversion is done in `downcastTable()`.
			conversion.for( 'upcast' ).add( upcastElementToElement( { model: 'tableRow', view: 'tr' } ) );

			// Table cell conversion.
			conversion.for( 'upcast' ).add( upcastElementToElement( { model: 'tableCell', view: 'td' } ) );
			conversion.for( 'upcast' ).add( upcastElementToElement( { model: 'tableCell', view: 'th' } ) );

			conversion.attributeToAttribute( { model: 'colspan', view: 'colspan' } );
			conversion.attributeToAttribute( { model: 'rowspan', view: 'rowspan' } );
		} );
	} );

	afterEach( () => {
		return editor.destroy();
	} );

	describe( 'insertRow()', () => {
		it( 'should insert row in given table at given index', () => {
			setData( model, modelTable( [
				[ '11[]', '12' ],
				[ '21', '22' ]
			] ) );

			tableUtils.insertRow( root.getNodeByPath( [ 0 ] ), { at: 1 } );

			expect( formatTable( getData( model ) ) ).to.equal( formattedModelTable( [
				[ '11[]', '12' ],
				[ '', '' ],
				[ '21', '22' ]
			] ) );
		} );

		it( 'should insert row in given table at default index', () => {
			setData( model, modelTable( [
				[ '11[]', '12' ],
				[ '21', '22' ]
			] ) );

			tableUtils.insertRow( root.getNodeByPath( [ 0 ] ) );

			expect( formatTable( getData( model ) ) ).to.equal( formattedModelTable( [
				[ '', '' ],
				[ '11[]', '12' ],
				[ '21', '22' ]
			] ) );
		} );

		it( 'should update table heading rows attribute when inserting row in headings section', () => {
			setData( model, modelTable( [
				[ '11[]', '12' ],
				[ '21', '22' ],
				[ '31', '32' ]
			], { headingRows: 2 } ) );

			tableUtils.insertRow( root.getNodeByPath( [ 0 ] ), { at: 1 } );

			expect( formatTable( getData( model ) ) ).to.equal( formattedModelTable( [
				[ '11[]', '12' ],
				[ '', '' ],
				[ '21', '22' ],
				[ '31', '32' ]
			], { headingRows: 3 } ) );
		} );

		it( 'should not update table heading rows attribute when inserting row after headings section', () => {
			setData( model, modelTable( [
				[ '11[]', '12' ],
				[ '21', '22' ],
				[ '31', '32' ]
			], { headingRows: 2 } ) );

			tableUtils.insertRow( root.getNodeByPath( [ 0 ] ), { at: 2 } );

			expect( formatTable( getData( model ) ) ).to.equal( formattedModelTable( [
				[ '11[]', '12' ],
				[ '21', '22' ],
				[ '', '' ],
				[ '31', '32' ]
			], { headingRows: 2 } ) );
		} );

		it( 'should expand rowspan of a cell that overlaps inserted rows', () => {
			setData( model, modelTable( [
				[ { colspan: 2, contents: '11[]' }, '13', '14' ],
				[ { colspan: 2, rowspan: 4, contents: '21' }, '23', '24' ],
				[ '33', '34' ]
			], { headingColumns: 3, headingRows: 1 } ) );

			tableUtils.insertRow( root.getNodeByPath( [ 0 ] ), { at: 2, rows: 3 } );

			expect( formatTable( getData( model ) ) ).to.equal( formattedModelTable( [
				[ { colspan: 2, contents: '11[]' }, '13', '14' ],
				[ { colspan: 2, rowspan: 7, contents: '21' }, '23', '24' ],
				[ '', '' ],
				[ '', '' ],
				[ '', '' ],
				[ '33', '34' ]
			], { headingColumns: 3, headingRows: 1 } ) );
		} );

		it( 'should not expand rowspan of a cell that does not overlaps inserted rows', () => {
			setData( model, modelTable( [
				[ { rowspan: 2, contents: '11[]' }, '12', '13' ],
				[ '22', '23' ],
				[ '31', '32', '33' ]
			], { headingColumns: 3, headingRows: 1 } ) );

			tableUtils.insertRow( root.getNodeByPath( [ 0 ] ), { at: 2, rows: 3 } );

			expect( formatTable( getData( model ) ) ).to.equal( formattedModelTable( [
				[ { rowspan: 2, contents: '11[]' }, '12', '13' ],
				[ '22', '23' ],
				[ '', '', '' ],
				[ '', '', '' ],
				[ '', '', '' ],
				[ '31', '32', '33' ]
			], { headingColumns: 3, headingRows: 1 } ) );
		} );

		it( 'should properly calculate columns if next row has colspans', () => {
			setData( model, modelTable( [
				[ { rowspan: 2, contents: '11[]' }, '12', '13' ],
				[ '22', '23' ],
				[ { colspan: 3, contents: '31' } ]
			], { headingColumns: 3, headingRows: 1 } ) );

			tableUtils.insertRow( root.getNodeByPath( [ 0 ] ), { at: 2, rows: 3 } );

			expect( formatTable( getData( model ) ) ).to.equal( formattedModelTable( [
				[ { rowspan: 2, contents: '11[]' }, '12', '13' ],
				[ '22', '23' ],
				[ '', '', '' ],
				[ '', '', '' ],
				[ '', '', '' ],
				[ { colspan: 3, contents: '31' } ]
			], { headingColumns: 3, headingRows: 1 } ) );
		} );

		it( 'should insert rows at the end of a table', () => {
			setData( model, modelTable( [
				[ '11[]', '12' ],
				[ '21', '22' ]
			] ) );

			tableUtils.insertRow( root.getNodeByPath( [ 0 ] ), { at: 2, rows: 3 } );

			expect( formatTable( getData( model ) ) ).to.equal( formattedModelTable( [
				[ '11[]', '12' ],
				[ '21', '22' ],
				[ '', '' ],
				[ '', '' ],
				[ '', '' ]
			] ) );
		} );
	} );
} );
