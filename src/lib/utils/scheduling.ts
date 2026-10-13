import type { OpeningHours } from '../types/index';
import { config as defaultConfig } from '../config/index';

/**
 * Retorna Date representando a hora local atual na empresa com base no fuso horário configurado.
 */
export function getCompanyDate(timezone: string = defaultConfig.timezone): Date {
	const nowStr = new Date().toLocaleString('en-US', { timeZone: timezone });
	return new Date(nowStr);
}

/**
 * Verifica se a empresa está aberta no momento com base no horário de funcionamento.
 */
export function isCompanyOpen(
	date: Date = getCompanyDate(defaultConfig.timezone),
	openingHours: Record<number, OpeningHours> = defaultConfig.openingHours
): boolean {
	const day = date.getDay();
	const hours = openingHours[day];
	if (!hours || hours.open === hours.close) return false; // Fechado

	const curMins = date.getHours() * 60 + date.getMinutes();
	const [oH, oM] = hours.open.split(':').map(Number);
	const [cH, cM] = hours.close.split(':').map(Number);
	const openMins = oH * 60 + oM;
	let closeMins = cH * 60 + cM;
	if (closeMins < openMins) closeMins += 24 * 60; // Passou da meia noite

	let checkMins = curMins;
	if (curMins < openMins && closeMins > 24 * 60) checkMins += 24 * 60;

	return checkMins >= openMins && checkMins <= closeMins;
}
