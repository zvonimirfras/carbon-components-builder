import React from 'react';
import {
	Checkbox,
	TextInput,
	Tile
} from 'carbon-components-react';
import { AComponent } from '../a-component';
import { TileMorphism } from './tile-morphism';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../../components/css-class-selector';
import { ComponentInfo } from '../';
import image from '../../assets/component-icons/tile.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../utils/fragment-tools';

export const ATileSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TileMorphism component={selectedComponent} setComponent={setComponent} />
		<Checkbox
			labelText='Light theme'
			id='theme-select'
			checked={selectedComponent.light}
			onChange={(checked: any) => {
				setComponent({
					...selectedComponent,
					light: checked
				});
			}}
		/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>;
};

export const ATileCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
		value={selectedComponent.codeContext?.name}
		labelText='Input name'
		onChange={(event: any) => {
			setComponent({
				...selectedComponent,
				codeContext: {
					...selectedComponent.codeContext,
					name: event.currentTarget.value
				}
			});
		}}
	/>;
};

export const ATile = ({
	children,
	componentObj,
	onDrop,
	selected,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		selected={selected}
		{...rest}>
			<Tile
			onDrop={onDrop}
			className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
			light={componentObj.light}>
				{children}
			</Tile>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATile,
	settingsUI: ATileSettingsUI,
	keywords: ['tile', 'card'],
	name: 'Tile',
	type: 'tile',
	defaultComponentObj: {
		type: 'tile',
		items: [
			{ type: 'text', text: 'A simple tile' }
		]
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents }) => <ATile
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}>
		{componentObj.items?.map((tile: any) => renderComponents(tile))}
	</ATile>,
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = '${json.light ? 'light' : ''}';`,
			outputs: (_) => '',
			imports: ['TilesModule'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<ibm-tile
					[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</ibm-tile>`;
			}
		},
		react: {
			imports: ['Tile'],
			code: ({ json, jsonToTemplate, fragments }) => {
				return `<Tile
					${json.light !== undefined ? `light="${json.light}"` : ''}
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</Tile>`;
			}
		}
	}
};
