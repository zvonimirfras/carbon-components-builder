import React, { useContext } from 'react';
import {
	Checkbox,
	TextInput
} from 'carbon-components-react';
import { Edit32 } from '@carbon/icons-react';
import { css, cx } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';

import image from './../assets/component-icons/button.svg';
import { GlobalStateContext } from '../context';
import { classNameFromFragment, tagNameFromFragment } from '../utils/fragment-tools';
import { LinkButton } from '../components';

export const AFragmentSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<LinkButton
		kind='secondary'
		size='sm'
		renderIcon={Edit32}
		className={css`margin-bottom: 1rem`}
		to={`/edit/${selectedComponent.id}`}>
			Edit fragment
		</LinkButton>
		<Checkbox
			labelText='Show outline'
			id='fragment-showOutline'
			checked={selectedComponent.showOutline}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				showOutline: checked
			})} />
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>;
};

export const AFragmentCodeUI = ({ selectedComponent, setComponent }: any) => {
	return (
		<TextInput
			value={selectedComponent.codeContext?.name}
			labelText='Input name'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						name: event.currentTarget.value
					}
				});
			}}
		/>
	);
};

const showOutlineStyle = css`
	outline: 1px dashed #78a9ff;
`;

export const AFragment = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		className={css`position: relative; display: inline-flex`}
		rejectDrop={true}
		{...rest}>
			<div
			style={{ pointerEvents: 'none' }}
			className={cx(
				componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
				componentObj.showOutline ? showOutlineStyle : ''
			)}>
				{children}
			</div>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AFragment,
	settingsUI: AFragmentSettingsUI,
	render: ({ componentObj, select, remove, selected, renderComponents }) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const globalState = useContext(GlobalStateContext); // used for fetching subcomponents/microlayouts
		const subFragment = globalState?.getFragment(componentObj.id);

		if (!subFragment) {
			return ''; // NOTE should we also remove it from the fragment?
		}

		return <AFragment
			componentObj={componentObj}
			select={select}
			remove={remove}
			selected={selected}>
				{renderComponents(subFragment.data)}
		</AFragment>;
	},
	keywords: ['fragment'],
	name: 'Fragment',
	hideFromElementsPane: true,
	type: 'fragment',
	defaultComponentObj: {
		type: 'fragment'
	},
	image,
	codeExport: { // TODO exports
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: [],
			code: ({ json, fragments }) => {
				const fragment = fragments?.find(f => f.id === json.id);
				return `<app-${tagNameFromFragment(fragment)}></app-${tagNameFromFragment(fragment)}>`;
			}
		},
		react: {
			imports: [],
			otherImports: ({ json, fragments }) => {
				const fragment = fragments?.find(f => f.id === json.id);
				return `import {${classNameFromFragment(fragment)}} from "/src/shared/${tagNameFromFragment(fragment)}.js";`;
			},
			code: ({ json, fragments }) => {
				const fragment = fragments?.find(f => f.id === json.id);
				return `<${classNameFromFragment(fragment)} state={state} setState={setState} />`;
			}
		}
	}
};
