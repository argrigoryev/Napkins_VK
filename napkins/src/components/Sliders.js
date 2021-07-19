import React, { useState, Fragment } from 'react';
import Slider from '@vkontakte/vkui/dist/components/Slider/Slider';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import Counter from '@vkontakte/vkui/dist/components/Counter/Counter';
import Snackbar from '@vkontakte/vkui/dist/components/Snackbar/Snackbar';
import Icon28Messages from '@vkontakte/icons/dist/28/messages';
import bridge from '@vkontakte/vk-bridge';
import PromoBanner from '@vkontakte/vkui/dist/components/PromoBanner/PromoBanner';

import { platform, IOS, ANDROID } from '@vkontakte/vkui';

const osName = platform();

const NAPKINS_IN_PACK 		= 10;
const DEFAULT_PACK_COUNT 	= 5;
const DEFAULT_NAPKINS_PER_DAY = 3;
const DEFAULT_WOMAN_COUNT = 2;
const IS_TAPTIC_SUPPORTED	= bridge.supports('VKWebAppTapticNotificationOccurred');

function throttle(callback, delay) {
	let isThrottled = false, args, context;

	function wrapper() {
		if (isThrottled) {
			args = arguments;
			context = this;
			return;
		}

		isThrottled = true;
		callback.apply(this, arguments);
		
		setTimeout(() => {
			isThrottled = false;
			if (args) {
				wrapper.apply(context, args);
				args = context = null;
			}
		}, delay);
	}
	return wrapper;
}

const Home = ({ fetchedState, snackbarError }) => {
	const [packsCount, setPacksCount] = useState(fetchedState.hasOwnProperty('packsCount') ? fetchedState.packsCount : DEFAULT_PACK_COUNT);
	const [napkinsPerDay, setNapkinsPerDay] = useState(fetchedState.hasOwnProperty('napkinsPerDay') ? fetchedState.napkinsPerDay : DEFAULT_NAPKINS_PER_DAY);
	const [womanCount, setWomanCount] = useState(fetchedState.hasOwnProperty('womanCount') ? fetchedState.womanCount : DEFAULT_WOMAN_COUNT);
	const [napkinsCount, setNapkinsCount] = useState(fetchedState.hasOwnProperty('napkinsCount') ? fetchedState.napkinsCount : NAPKINS_IN_PACK * DEFAULT_PACK_COUNT);
    const [snackbar, setSnackbar] = useState(snackbarError);
    const [ads, setAds] = useState(null);

	const onSheet = async function () {
		if (IS_TAPTIC_SUPPORTED) {
			await bridge.send('VKWebAppTapticNotificationOccurred', { type: napkinsCount <= 0 ? 'error' : 'success' });
		}
		if (napkinsCount <= 0) {
			setSnackbar(<Snackbar
				layout='vertical'
				onClose={() => setSnackbar(null)}
				before={<Avatar size={24} style={{backgroundColor: '#E83A93'}}><Icon28Messages fill='#fff' width={14} height={14} /></Avatar>}
				duration={900}
			>
				У вас не осталось прокладок
			</Snackbar>);
			setPacksCount(0);
			return;
		}
		const newNapkinsCount = napkinsCount - 1;
		const newPacksCount = Math.floor(newNapkinsCount / NAPKINS_IN_PACK);

		setNapkinsCount(newNapkinsCount);
		if (packsCount !== newPacksCount && newPacksCount !== 0) {
			setPacksCount(newPacksCount);
		}
		setSnackbar(<Snackbar
			layout='vertical'
			onClose={() => setSnackbar(null)}
			before={<Avatar size={24} style={{backgroundColor: '#E83A93'}}><Icon28Messages fill='#fff' width={14} height={14} /></Avatar>}
			duration={900}
		>
			{newNapkinsCount <= 0 ? 'У вас не осталось прокладок' : `Прокладка потрачена, осталось ${newNapkinsCount}`}
		</Snackbar>);
		setStorage({
			napkinsCount: newNapkinsCount
		});
	}

	const setStorage = async function(properties) {
		await bridge.send('VKWebAppStorageSet', {
			key: 'state',
			value: JSON.stringify({
				packsCount,
				napkinsPerDay,
				womanCount,
				napkinsCount,
				...properties
			})
		});
	}

	const countDays = function() {
		const sheetsPerDay = napkinsPerDay * womanCount;
		const totalSheets = packsCount * NAPKINS_IN_PACK;
		return Math.round(totalSheets / sheetsPerDay);
	}

	const onPacksChange = throttle(packs => {
        if (packs === packsCount) return;
        setNapkinsCount(napkinsCount + (packs - packsCount) * NAPKINS_IN_PACK);
		setPacksCount(packs);
		setStorage();
	}, 200);

	const onNapkinsPerDayChange = throttle(napkins => {
		if (napkins === napkinsPerDay) return;
		setNapkinsPerDay(napkins)
		setStorage();
	}, 200);

	const onWomanChange = throttle(woman => {
		if (woman === womanCount) return;
        setWomanCount(woman);
		setStorage();
    }, 200);
    
    const getAds = async () => {
		const adv = await bridge.send("VKWebAppGetAds", {});
		setAds(adv);
	}

	if (!ads &&(osName === IOS || osName === ANDROID)) {
		getAds();
	}

	return (
		<Fragment>
			<Group>
				<h1 className='DaysLeftHeading'>{countDays()}</h1>
				<h3 className='DaysLeftSubheading'>Количество "застрахованных" дней</h3>
			</Group>
			<FormLayout>
					<Slider
						step={1}
						min={0}
						max={30}
						value={packsCount}
						top={
							<Header indicator={<Counter size='m' mode='primary'>{packsCount}</Counter>}>
								<span role='img' aria-label='Flower'>🌸</span> Количество упаковок
							</Header>
						}
						onChange={(packs) => onPacksChange(packs)}
					/>
					<Slider
						step={1}
						min={1}
						max={8}
						value={napkinsPerDay}
						top={
							<Header indicator={<Counter size='m' mode='primary'>{napkinsPerDay}</Counter>}>
								<span role='img' aria-label='Flower'>🌷</span> Тратите прокладок в день
							</Header>
						}
						onChange={napkins => onNapkinsPerDayChange(napkins)}
					/>
					<Slider
						step={1}
						min={1}
						max={16}
						value={womanCount}
						top={
							<Header indicator={<Counter size='m' mode='primary'>{womanCount}</Counter>}>
								<span role='img' aria-label='Woman'>💃🏼</span> Женщин в доме
							</Header>
						}
						onChange={woman => onWomanChange(woman)}
					/>
			</FormLayout>
            
            <Div className='PooBtnContainer'>
                    <Button className='Btn' size='xl' onClick={onSheet}>Использовать одну прокладку</Button>
			</Div>

            { ads && <PromoBanner bannerData={ ads } /> }
			{snackbar}
		</Fragment>
	);
};

export default Home;