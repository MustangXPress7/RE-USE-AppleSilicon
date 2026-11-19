module.exports = async (kernel, info) => {
	const menu = [];

	// The real launcher lives in app/ after install.js clones the mac-mlx branch.
	if (!info.exists('app/.env')) {
		menu.push({
			icon: 'fa-solid fa-plug',
			text: 'Install',
			href: 'install.js',
			params: {
				run: true,
				fullscreen: true
			}
		});
		return menu;
	}

	if (!info.running('app/run.js') && !info.running('app/install.js')) {
		menu.push({
			icon: 'fa-solid fa-power-off',
			text: 'Run RE-USE',
			href: 'app/run.js',
			params: {
				run: true,
				fullscreen: true,
				mode: 'Default'
			}
		});
	}

	if (info.running('app/run.js')) {
		const memory = info.local('app/run.js');

		if (memory && memory.url && memory.mode) {
			menu.push({
				icon: 'fa-solid fa-rocket',
				text: 'Open UI (' + memory.mode + ')',
				href: memory.url,
				params: {
					run: true,
					fullscreen: true
				}
			});
		}
		menu.push({
			icon: 'fa-solid fa-desktop',
			text: 'CLI',
			href: 'app/run.js',
			params: {
				run: true,
				fullscreen: true
			}
		});
	} else {
		[
			['fa-solid fa-plug', 'Install', 'install.js'],
			['fa-solid fa-rotate', 'Reinstall', 'install.js'],
			['fa-solid fa-microchip', 'Verify Metal', 'app/verify.js'],
			['fa-solid fa-arrow-rotate-right', 'Update', 'app/update.js'],
			['fa-solid fa-trash', 'Reset', 'app/reset.js']
		].forEach(([icon, text, href]) => {
			menu.push({
				icon,
				text,
				href,
				params: {
					run: true,
					fullscreen: true
				}
			});
		});
	}

	return menu;
};
