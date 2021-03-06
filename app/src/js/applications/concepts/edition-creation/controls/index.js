import React from 'react';
import PropTypes from 'prop-types';
import ConceptCreateControlLayout from './controls-layout';
import { propTypes as notesPropTypes } from 'js/utils/concepts/notes';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as conceptsWithLinksPropTypes } from 'js/utils/concepts/links';
import validate from './validation';

function ConceptCreateControl({
	oldGeneral,
	general,
	notes,
	conceptsWithLinks,
	maxLengthScopeNote,
	handleSave,
	redirectCancel,
}) {
	const errorMessage = validate(
		oldGeneral,
		general,
		notes,
		conceptsWithLinks,
		maxLengthScopeNote
	);

	return (
		<ConceptCreateControlLayout
			handleSave={handleSave}
			message={errorMessage}
			saveEnabled={!errorMessage}
			redirectCancel={redirectCancel}
		/>
	);
}

ConceptCreateControl.propTypes = {
	oldGeneral: generalPropTypes.isRequired,
	general: generalPropTypes.isRequired,
	notes: notesPropTypes.isRequired,
	conceptsWithLinks: conceptsWithLinksPropTypes.isRequired,
	handleSave: PropTypes.func.isRequired,
	redirectCancel: PropTypes.func.isRequired,
};
export default ConceptCreateControl;
