import React, { useState, useCallback, useEffect } from 'react';
import './component-selector.scss';
import { MutualizedComponentsSelector } from '../mutualized-component-selector';
import { StructureComponentsSelector } from '../structure-component-selector';
import ComponentSpecificationModal from '../component-specification-modal';
import PropTypes from 'prop-types';
import {
	ATTRIBUTE_PROPERTY_TYPE,
	ATTRIBUTE_TYPE,
	DIMENSION_PROPERTY_TYPE,
	MEASURE_PROPERTY_TYPE,
} from '../../utils/constants/dsd-components';
import { CodesListPanel } from "../codes-list-panel/codes-list-panel"
import { OBSERVATION } from '../../utils/constants';

const filterComponentDefinition = (type) => (componentDefinition) =>
	componentDefinition?.component?.type === type;

const filterComponent = (type) => (component) => component?.type === type;

const ComponentSelector = ({
	componentDefinitions,
	mutualizedComponents,
	concepts,
	codesLists,
	handleUpdate,
	type,
	structure
}) => {
	const [codesListNotation, setCodesListNotation] = useState(undefined);
	const handleCodesListDetail = useCallback(notation => {
		setCodesListNotation(notation);
	}, [])
	const [structureComponents, setStructureComponents] = useState(
		[]
	);

	const [modalOpened, setModalOpened] = useState(false);
	const [selectedComponent, setSelectedComponent] = useState({});

	const [
		filteredMutualizedComponents,
		setFilteredMutualizedComponents,
	] = useState(mutualizedComponents);

	useEffect(() => {
		setStructureComponents(componentDefinitions);
	}, [componentDefinitions]);

	useEffect(() => {
		setFilteredMutualizedComponents(
			mutualizedComponents.filter(filterComponent(type)).filter((component) => {
				return !structureComponents.find(
					({ component: c }) => c.id === component.id
				);
			})
		);
	}, [mutualizedComponents, structureComponents, type]);

	const handleSpecificationClick = useCallback((component) => {
		setSelectedComponent(component);
		setModalOpened(true);
	}, []);

	const handleCreateOrUpdate = useCallback(
		(components, isCreation, component) => {

			if (isCreation) {
				const componentsByType = _groupByType(structureComponents);
				componentsByType[component.component.type].push(component);

				const newComponents = _makeFlat(componentsByType)
				_handleAttributeComponent(component);
				setStructureComponents(newComponents);
				handleUpdate(newComponents);
			} else {
				setStructureComponents(components);
				handleUpdate(components);
			}
		},
		[handleUpdate, structureComponents]
	);


	const handleRemove = useCallback(
		(id) => {
			const filteredComponentsByType = _groupByType(structureComponents
				.filter(({ component }) => component.identifiant !== id))

			const filteredComponents = _makeFlat(filteredComponentsByType)
			setStructureComponents(filteredComponents);
			handleUpdate(filteredComponents);
		},
		[handleUpdate, structureComponents]
	);

	const saveSpecification = useCallback(
		(specification) => {
			const component = {
				...selectedComponent,
				...specification,
			};
			let components;
			components = structureComponents.map((c) => {
				if (c.order === component.order && c.component.type === component.component.type) {
					return component;
				}
				return c;
			});

			setStructureComponents(components);
			handleUpdate(components);
			setSelectedComponent({});

			setModalOpened(false);
		},
		[handleUpdate, structureComponents, selectedComponent]
	);

	const _handleAttributeComponent = (component) => {
		if (component.type === ATTRIBUTE_TYPE) {
			setSelectedComponent(component);
			setModalOpened(true);
		}
	};

	const _groupByType = (components) => {
		const componentsByType = components.reduce((acc, structureComponent) => {
			return {
				...acc,
				[structureComponent.component.type]: [...acc[structureComponent.component.type], structureComponent]
			}
		}, {
			[ATTRIBUTE_PROPERTY_TYPE]: [],
			[DIMENSION_PROPERTY_TYPE]: [],
			[MEASURE_PROPERTY_TYPE]: []
		})
		return componentsByType;
	}

	const _makeFlat = (componentsByType) => {
		const dimensions = componentsByType[DIMENSION_PROPERTY_TYPE];
		const measures = componentsByType[MEASURE_PROPERTY_TYPE]
		return [
			...dimensions.map((component, index) => ({...component, order: index + 1 })),
			...measures.map((component, index) => ({...component, order: dimensions.length + index + 1 })),
			...componentsByType[ATTRIBUTE_PROPERTY_TYPE].map((component, index) => ({...component, order: dimensions.length + measures.length + index + 1 }))
		]
	}

	const handleAdd = useCallback(
		(id) => {

			const componentsByType = _groupByType(structureComponents);
			const component = mutualizedComponents.find((c) => c.identifiant === id);
			const newStructureComponent = { component, order: componentsByType[component.type].length + 1 };
			if(component.type === ATTRIBUTE_PROPERTY_TYPE){
				newStructureComponent.attachment = [OBSERVATION]
			}

			componentsByType[component.type].push(newStructureComponent)
			const components = _makeFlat(componentsByType);

			setStructureComponents(components);
			handleUpdate(components);

			_handleAttributeComponent(component);
		},
		[handleUpdate, mutualizedComponents, structureComponents]
	);

	const handleUp = useCallback(
		(id) => {
			const structureComponent = structureComponents.find(
				(cs) => cs.component.identifiant === id
			);
			const componentByType = _groupByType(structureComponents);
			const componentArrayToUpdate = componentByType[structureComponent.component.type];

			const index = structureComponent.order - 1;
			const startArray = componentArrayToUpdate.slice(0, index - 1);
			const endArray = componentArrayToUpdate.slice(index + 1);

			componentByType[structureComponent.component.type] = [
				...startArray,
				{
					...componentArrayToUpdate[index],
					order: structureComponents[index - 1].order,
				},
				{
					...componentArrayToUpdate[index - 1],
					order: structureComponents[index].order,
				},
				...endArray,
			];

			const components = _makeFlat(componentByType)
			setStructureComponents(components);
			handleUpdate(components);
		},

		[handleUpdate, structureComponents]
	);
	const handleDown = useCallback(
		(id) => {
			const structureComponent = structureComponents.find(
				(cs) => cs.component.identifiant === id
			);
			const componentByType = _groupByType(structureComponents);
			const componentArrayToUpdate = componentByType[structureComponent.component.type];

			const index = structureComponent.order - 1;

			const startArray = componentArrayToUpdate.slice(0, index);
			const endArray = componentArrayToUpdate.slice(index + 2);
			componentByType[structureComponent.component.type] = [
				...startArray,
				{
					...structureComponents[index + 1],
					order: structureComponents[index].order,
				},
				{
					...structureComponents[index],
					order: structureComponents[index + 1].order,
				},
				...endArray,
			];
			const components = _makeFlat(componentByType)
			setStructureComponents(components);
			handleUpdate(components);
		},
		[handleUpdate, structureComponents]
	);

	return (
		<>
			{modalOpened && (
				<ComponentSpecificationModal
					onClose={() => setModalOpened(false)}
					structureComponents={structureComponents}
					specification={{
						attachment: selectedComponent.attachment,
						required: selectedComponent.required,
					}}
					onSave={saveSpecification}
				/>
			)}

			<StructureComponentsSelector
				hidden={false}
				codesLists={codesLists}
				concepts={concepts}
				componentDefinitions={componentDefinitions.filter(filterComponentDefinition(type))}
				handleRemove={handleRemove}
				handleUp={handleUp}
				handleDown={handleDown}
				handleCreateOrUpdate={handleCreateOrUpdate}
				handleSpecificationClick={handleSpecificationClick}
				readOnly={false}
				type={type}
				handleCodesListDetail={handleCodesListDetail}
				structure={structure}
			/>

			<MutualizedComponentsSelector
				concepts={concepts}
				codesLists={codesLists}
				hidden={true}
				components={filteredMutualizedComponents}
				handleAdd={handleAdd}
				readOnly={true}
				handleCodesListDetail={handleCodesListDetail}
			/>
			<CodesListPanel codesList={codesListNotation} isOpen={!!codesListNotation} handleBack={() => setCodesListNotation(undefined)}/>
		</>
	);
};

ComponentSelector.propTypes = {
	components: PropTypes.array,
	mutualizedComponents: PropTypes.array,
	concepts: PropTypes.array,
	codesLists: PropTypes.array,
	handleUpdate: PropTypes.func,
};

ComponentSelector.defaultProps = {
	components: [],
	concepts: [],
	codesLists: [],
};
export default ComponentSelector;
