import React, { useEffect, useContext, useState } from 'react';
import Header from '~/components/Header';
import Footer from '~/components//Footer';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { i18n } from '~/i18n';
import { I18nContext } from 'next-i18next';
import Select, { components } from 'react-select';
import { appSettings } from '~/config';
import Menu from '~/components/Menu';
import { teacherGetHolidays } from '~/api/teacherAPI';
import { useRouter } from 'next/router';

const Layout = ({
	children,
	title = 'E-talk Elearning',
	isStudent = false,
}) => {
	const router = useRouter();
	useEffect(() => {
		isStudent ? (appSettings.UID = 1071) : (appSettings.UID = 20);
	}, [isStudent]);

	useEffect(() => {
		let UID = null;
		let Token = null;

		// GET UID and Token
		if (localStorage.getItem('UID')) {
			UID = localStorage.getItem('UID');
			Token = localStorage.getItem('token');
		}

		(async () => {
			try {
				const res = await teacherGetHolidays({
					UID: UID,
					Token: Token,
					Page: 1,
				});
				if (res.Code === 403) {
					localStorage.clear();
					router.push('/login/signin');
				}
			} catch (error) {
				console.log('Error: ', error);
			}
		})();
	}, [router]);

	return (
		<>
			<Head>
				<title>{title}</title>
				<script src="/static/assets/js/dashforge.js"></script>
				<script src="/static/js/dashforge.aside.js"></script>
				<script src="/static/js/custom.js"></script>
			</Head>
			<Menu isStudent={isStudent} />
			<main className="content ht-100vh pd-0-f testthu">
				<Header isStudent={isStudent} />
				<div className="content-body" id="body-content">
					{children}
				</div>
				<Footer />
			</main>
		</>
	);
};
export const getLayout = (page) => <Layout>{page}</Layout>;

export const getStudentLayout = (page) => (
	<Layout isStudent={true}>{page}</Layout>
);

export default Layout;
