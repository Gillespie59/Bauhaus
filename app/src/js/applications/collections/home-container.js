import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import CollectionsHome from './home';
import { NOT_LOADED } from 'js/constants';
import loadCollectionList from 'js/actions/collections/list';
import { Auth } from 'bauhaus-utilities';

class CollectionsHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.collections) {
			this.props.loadCollectionList();
		}
	}

	render() {
		const { collections, permission } = this.props;

		if (!collections) {
			return <Loading />;
		}
		return (
			<CollectionsHome collections={collections} permission={permission} />
		);
	}
}

const mapStateToProps = state => {
	const permission = Auth.getPermission(state);
	if (!state.collectionList) {
		return {
			status: NOT_LOADED,
			collections: [],
		};
	}
	let { results: collections, status, err } = state.collectionList;
	return {
		collections,
		permission,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadCollectionList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CollectionsHomeContainer);
