import React, {
	useContext,
	useEffect,
	useState
} from 'react';
import { css, cx } from 'emotion';
import {
	Fragment,
	getParentComponent,
	getSelectedComponent,
	initializeIds,
	stateWithoutComponent,
	updatedState
} from '../../components';
import { EditHeader } from './edit-header';
import { GlobalStateContext } from '../../context/global-state-context';
import {
	Button,
	SideNav,
	SideNavLink,
	SideNavItems,
	Tabs,
	Tab
} from 'carbon-components-react';
import {
	Code16,
	ColorPalette16,
	SettingsAdjust16,
	Copy32,
	Development16,
	Information16,
	TrashCan32
} from '@carbon/icons-react';

import { ElementsPane } from './elements-pane';
import { StylePane } from './style-pane';
import { CodePane } from './code-pane';

import { SettingsContextPane } from './settings-context-pane';
import { CodeContextPane } from './code-context-pane';
import { useParams } from 'react-router-dom';

const leftPaneWidth = '300px';
const rightPaneWidth = '302px';
const railWidth = '48px';
const transitionDetails = '0.11s cubic-bezier(0.2, 0, 1, 0.9)';

const editPageContent = css`
	position: absolute;
	width: 100vw;
	height: calc(100% - 3rem);
	top: 3rem;
	max-width: 100%;
	background: #f4f4f4;

	.edit-content {
		padding: 1rem;
		margin: 0 ${rightPaneWidth} 0 ${railWidth};
		width: calc(100% - ${rightPaneWidth} - ${railWidth});
		height: calc(100% - 64px);
		transition: margin-left ${transitionDetails}, width ${transitionDetails};
		overflow: auto;

		&.is-side-panel-active {
			margin-left: calc(${railWidth} + ${leftPaneWidth});
			width: calc(100% - ${leftPaneWidth} - ${rightPaneWidth} - ${railWidth});
		}
	}
`;

const sideRail = css`
	transition: left ${transitionDetails};

	&.bx--side-nav, &.bx--side-nav:hover {
		.bx--side-nav__item .bx--side-nav__link {
			height: 3rem;
		}
	}

	&.bx--side-nav--ux {
		top: 7rem;
		box-shadow: inset -1px 0px #d8d8d8;
	}

	&.is-active {
		left: ${leftPaneWidth};
	}

	.bx--side-nav__items {
		padding: 0;
	}
`;

export const leftPane = css`
	position: absolute;
	background: white;
	transition: left 0.11s cubic-bezier(0.2, 0, 1, 0.9);
	width: ${leftPaneWidth};
	left: -${leftPaneWidth};
	height: calc(100% - 4rem);
	padding: 0 15px;
	box-shadow: inset -1px 0px #d8d8d8;
	z-index: 999;
	overflow-y: auto;
	overflow-x: hidden;

	&.is-active {
		left: 0;
	}
`;

export const leftPaneHeader = css`
	position: fixed;
	width: 270px;
	background: white;
`;

const rightPanel = css`
	width: ${rightPaneWidth};
	position: absolute;
	right: 0;
	top: 4rem;
	background: white;
	min-height: calc(100vh - 7rem);
	box-shadow: inset 1px 0px #d8d8d8;
	z-index: 1;

	.bx--tabs--scrollable__nav-item .bx--tabs--scrollable__nav-link {
		width: 100px;
		text-align: center;
	}

	.context-pane-content {
		overflow: auto;
		height: calc(100vh - 15rem);
	}
`;

const actionsStyle = css`
	position: absolute;
	bottom: 0;
	margin: 15px;
`;

enum SelectedLeftPane {
	NONE = 'none',
	ELEMENTS = 'elements',
	STYLE = 'style',
	CODE = 'code'
}

export const Edit = () => {
	const {
		fragments,
		updateFragment,
		clearActionHistory,
		addAction,
		styleClasses
	} = useContext(GlobalStateContext);

	const params = useParams();

	const fragment = fragments.find((fragment: any) => fragment.id === params.id);

	const [selectedLeftPane, setSelectedLeftPane] = useState(SelectedLeftPane.NONE);

	useEffect(() => {
		if (fragment && fragment.title) {
			document.title = `Edit "${fragment.title}"`;
		} else {
			document.title = 'Edit fragment';
		}
	}, [fragment]);

	useEffect(() => {
		clearActionHistory();
		addAction({ fragment, styleClasses });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onRailClick = (clickedLeftPane: SelectedLeftPane) => {
		if (clickedLeftPane === selectedLeftPane) {
			setSelectedLeftPane(SelectedLeftPane.NONE);
		} else {
			setSelectedLeftPane(clickedLeftPane);
		}
	};

	const selectedComponent = getSelectedComponent(fragment);
	const parentComponent = getParentComponent(fragment.data, selectedComponent);

	return (
		<div
			id='edit-wrapper'
			className={editPageContent}>
			{fragment && <EditHeader fragment={fragment} />}
			<ElementsPane isActive={selectedLeftPane === SelectedLeftPane.ELEMENTS} />
			<StylePane isActive={selectedLeftPane === SelectedLeftPane.STYLE} />
			<CodePane isActive={selectedLeftPane === SelectedLeftPane.CODE} />
			<SideNav
			aria-label='Side navigation'
			className={cx(sideRail, selectedLeftPane !== SelectedLeftPane.NONE ? 'is-active' : '')}
			isRail>
				<SideNavItems>
					<SideNavLink
					renderIcon={Development16}
					onClick={() => onRailClick(SelectedLeftPane.ELEMENTS)}
					isActive={selectedLeftPane === SelectedLeftPane.ELEMENTS}>
						Elements
					</SideNavLink>
					<SideNavLink
					renderIcon={ColorPalette16}
					onClick={() => onRailClick(SelectedLeftPane.STYLE)}
					isActive={selectedLeftPane === SelectedLeftPane.STYLE}>
						Style
					</SideNavLink>
					<SideNavLink
					renderIcon={Code16}
					onClick={() => onRailClick(SelectedLeftPane.CODE)}
					isActive={selectedLeftPane === SelectedLeftPane.CODE}>
						Code
					</SideNavLink>
				</SideNavItems>
			</SideNav>
			<div
			className={cx('edit-content', selectedLeftPane !== SelectedLeftPane.NONE ? 'is-side-panel-active' : '')}
			onClick={() => updateFragment({ ...fragment, selectedComponentId: null })}>
				{
					// eslint-disable-next-line
					fragment && <Fragment fragment={fragment} setFragment={updateFragment} />
				}
			</div>
			<div className={rightPanel}>
				<Tabs>
					<Tab
					id='properties-settings'
					label={<SettingsAdjust16 />}>
						<SettingsContextPane fragment={fragment} setFragment={updateFragment} />
					</Tab>
					<Tab
					id='properties-code'
					label={<Code16 />}>
						<CodeContextPane fragment={fragment} setFragment={updateFragment} />
					</Tab>
					<Tab
					id='properties-info'
					label={<Information16 />}>
						info
					</Tab>
				</Tabs>
				<div className={actionsStyle}>
					<Button
					kind='secondary'
					disabled={!fragment.selectedComponentId} // disabled for fragment
					renderIcon={Copy32}
					className={css`margin-right: 8px`}
					onClick={
						() => updateFragment({
							...fragment,
							data: updatedState(
								fragment.data, {
									type: 'insert',
									component: JSON.parse(JSON.stringify(initializeIds(selectedComponent, true))) // full clone, new Ids
								},
								parentComponent.id,
								parentComponent.items.indexOf(selectedComponent) + 1
							)
						})
					}>
						Duplicate
					</Button>
					<Button
					kind='danger'
					disabled={!fragment.selectedComponentId} // disabled for fragment
					renderIcon={TrashCan32}
					onClick={
						() => updateFragment({
							...fragment,
							data: stateWithoutComponent(fragment.data, fragment.selectedComponentId)
						})
					}>
						Delete
					</Button>
				</div>
			</div>
		</div>
	);
};
