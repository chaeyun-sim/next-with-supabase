import SideBar from '../side-bar';

export default async function MainLayout({ children }) {
	return (
		<main className='w-full h-screen flex items-center justify-center'>
			<SideBar />
			<div className='w-full h-full'>{children}</div>
		</main>
	);
}
