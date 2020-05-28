import React, { useState, useEffect } from 'react';
import {
	NewButton,
	SearchableList,
	PageTitle,
	VerticalMenu,
	Loading,
} from '@inseefr/wilco';
import './component-list.scss';
import { FilterToggleButtons } from 'bauhaus-utilities';
import { MUTUALIZED_COMPONENT_TYPES } from '../../utils/constants/dsd-components';

import { formatLabel } from '../../utils';
import api from '../../apis/structure-api';
import D from '../../i18n/build-dictionary';

const ALL = 'ALL';
function ComponentsList() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState(ALL);
	const filteredItems = items
		.filter(item => {
			return filter === ALL || item?.type === filter;
		})
		.map(({ id, labelLg1, labelLg2 }) => ({ id, labelLg1, labelLg2 }));

	useEffect(() => {
		api
			.getMutualizedComponents()
			.then(components => {
				setItems(components);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <Loading />;
	}
	return (
		<div className="container structures-components-list">
			<div className="row">
				<VerticalMenu>
					<NewButton action="/structures/components/create" wrapper={false} />
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.componentTitle} col={12} offset={0} />
					<FilterToggleButtons
						currentValue={filter}
						handleSelection={setFilter}
						options={[
							[ALL, D.all],
							...MUTUALIZED_COMPONENT_TYPES.map(type => [
								type.value,
								type.label,
							]),
						]}
					/>
					<SearchableList
						items={filteredItems}
						childPath="structures/components"
						searchUrl="/structures/components/search"
						advancedSearch={true}
						label="label"
						autoFocus={true}
						itemFormatter={(_, component) => formatLabel(component)}
					/>
				</div>
			</div>
		</div>
	);
}

export default ComponentsList;
