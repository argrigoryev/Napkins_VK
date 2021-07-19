import React, { Fragment } from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

import './Intro.css';

const Intro = ({ id, go, route, fetchedUser, userHasSeenIntro }) => (
	<Panel id={id} centered={true}>
		<PanelHeader>MonthCare</PanelHeader>
		{(fetchedUser && !userHasSeenIntro) &&
			<Fragment>
				<Group>
					<Div className='User'>
						{fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
						<h2>Привет, {fetchedUser.first_name}</h2>
						<h3>Этот сервис помогает следить за тем, чтобы прокладки в твоей сумочке не заканчивались и тебе не приходилось просить у подружек помочь в этот неловкий момент. Теперь ты будешь спасителем всего вуза, отдела или класса, ведь твоя сумка теперь будет "застрахована" от неожиданностей.</h3>
					</Div>
				</Group>
				<FixedLayout vertical='bottom'>
					<Div>
						<Button className='OKBtn' size="xl" level="2" onClick={() => go(route)}>
							ОК, всё понятно
						</Button>
					</Div>
				</FixedLayout>
			</Fragment>
		}
	</Panel>
);
export default Intro;