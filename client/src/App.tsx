import { BrowserRouter, Routes, Route } from 'react-router';
import { Home } from './pages/home';
import { Main } from './layout';

import './index.css';
import { DeviceDetail } from './components/device';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Main />}>
						<Route index element={<Home />} />
						<Route path="/device/:deviceId" element={<DeviceDetail />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
