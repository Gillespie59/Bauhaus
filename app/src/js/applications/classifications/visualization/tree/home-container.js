import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import ClassificationTree from './home';
import { buildExtract, Loading } from '@inseefr/wilco';
import loadClassificationItems from 'js/actions/classifications/items';
import loadClassificationGeneral from 'js/actions/classifications/general';
import * as selectT from 'js/reducers/classifications/items';
import * as selectG from 'js/reducers/classifications/classification/general';
import { getTreeFromFlatData } from 'react-sortable-tree';
import { Stores } from 'bauhaus-utilities';

const extractId = buildExtract('id');

class ClassificationTreeContainer extends Component {
	constructor(props) {
		super();
	}
	componentWillMount() {
		const { flatTree, general, id } = this.props;
		if (!flatTree) this.props.loadClassificationItems(id);
		if (!general) this.props.loadClassificationGeneral(id);
	}
	componentWillReceiveProps({ id }) {
		if (id !== this.props.id) {
			this.props.loadClassificationItems(id);
			this.props.loadClassificationGeneral(id);
		}
	}
	render() {
		const { flatTree, general, secondLang } = this.props;
		if (!(flatTree && general)) return <Loading />;
		const { prefLabelLg1, prefLabelLg2 } = general;
		const label = secondLang ? 'labelLg2' : 'labelLg1';
		const data =
			(flatTree.length !== 0 &&
				flatTree[0][label] &&
				getTreeFromFlatData({
					flatData: flatTree.map(n => ({
						id: n.id,
						//title: '',
						label: n[label] ? `${n.id} - ${n[label]}` : n.id,
						parent: n.parent || null,
					})),
					getKey: node => node.id,
					getParentKey: node => node.parent,
					rootKey: null,
				})) ||
			[];
		return (
			<ClassificationTree
				prefLabel={secondLang ? prefLabelLg2 : prefLabelLg1}
				data={data}
				secondLang={secondLang}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const flatTree = selectT.getItems(state, id);
	const general = selectG.getGeneral(state.classificationGeneral, id);
	const secondLang = Stores.SecondLang.getSecondLang(state);
	return {
		id,
		flatTree,
		general,
		secondLang,
	};
};

const mapDispatchToProps = {
	loadClassificationItems,
	loadClassificationGeneral,
};

ClassificationTreeContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ClassificationTreeContainer);

ClassificationTreeContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};
export default ClassificationTreeContainer;
