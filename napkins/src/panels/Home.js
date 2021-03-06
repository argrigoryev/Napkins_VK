import React from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Sliders from '../components/Sliders.js';

import './Home.css';

const Home = ({ id, snackbarError, fetchedState }) => {

	return (
		<Panel id={id}>
			<PanelHeader>Проводим подсчеты</PanelHeader>
			{fetchedState && <Sliders fetchedState={fetchedState} snackbarError={snackbarError} />}
		</Panel>
	);
};

export default Home;