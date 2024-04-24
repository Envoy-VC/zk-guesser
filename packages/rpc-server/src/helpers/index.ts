import { SingleForeignCallParam } from '../../types';

export const parseCoordinates = (params: SingleForeignCallParam[]) => {
	let coordinates = [];
	for (let index = 0; index < params.length; index += 3) {
		const sign = parseInt(params[index]!.Single, 16) === 1 ? -1 : 1;
		const integral = parseInt(params[index + 1]!.Single, 16);
		const fractional = parseInt(params[index + 2]!.Single, 16);
		const totalDecimals = String(fractional).length;
		coordinates.push(
			sign * (integral + fractional / Math.pow(10, totalDecimals))
		);
	}

	return coordinates as [number, number, number, number];
};

export const calculateDistance = (
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number => {
	const R = 6371; // Radius of the earth in km
	const dLat = deg2rad(lat2 - lat1);
	const dLon = deg2rad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c;
	return Number(d.toFixed(0));
};

function deg2rad(deg: number): number {
	return deg * (Math.PI / 180);
}
