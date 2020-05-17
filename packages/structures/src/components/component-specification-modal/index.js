import React, { useState } from 'react';
import Modal from 'react-modal';
import D from '../../i18n/build-dictionary';
import { SaveButton } from '@inseefr/wilco';
import { ComponentSpecificationForm } from '../component-specification-form';
import './component-specification-modal.scss';

export default ({
	specification: defaultSpecification,
	structureComponents,
	onClose,
	onSave,
}) => {
	const [specification, setSpecification] = useState(
		defaultSpecification || {}
	);

	return (
		<Modal
			className="Modal__Bootstrap modal-dialog structures structures-specification-modal"
			isOpen={true}
			ariaHideApp={false}
		>
			<div className="modal-content">
				<div className="modal-header">
					<button type="button" className="close" onClick={onClose}>
						<span aria-hidden="true">&times;</span>
						<span className="sr-only">{'btnClose'}</span>
					</button>
					<h4 className="modal-title">{D.componentSpecificationTitle}</h4>
				</div>

				<div className="modal-body">
					<ComponentSpecificationForm
						onChange={setSpecification}
						component={specification}
						structureComponents={structureComponents}
					/>
				</div>
				<div className="modal-footer">
					<div className="text-right">
						<SaveButton
							col={4}
							offset={8}
							action={() => onSave(specification)}
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};
