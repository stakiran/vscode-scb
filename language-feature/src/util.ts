import * as moment from 'moment';
moment.locale('ja');

class DateTime {
	private _momentinst: moment.Moment;
	private _format: string;

	public constructor() {
		this._momentinst = moment();
		this._format = 'YYYY/MM/DD';
	}

	public toString() {
		return this._momentinst.format(this._format);
	}
}

class DateTimeUtil {
	static todayString(): string {
		const dtobj = new DateTime();
		return dtobj.toString();
	}

	static nowtimeString(): string {
		return moment().format('HH:mm');
	}
}

function fixInvalidFilename(filename: string) {
	let newFilename = filename;
	const after = '_';
	newFilename = newFilename.replace(/\\/g, after);
	newFilename = newFilename.replace(/\//g, after);
	newFilename = newFilename.replace(/:/g, after);
	newFilename = newFilename.replace(/\*/g, after);
	newFilename = newFilename.replace(/\?/g, after);
	newFilename = newFilename.replace(/"/g, after);
	newFilename = newFilename.replace(/>/g, after);
	newFilename = newFilename.replace(/</g, after);
	newFilename = newFilename.replace(/\|/g, after);
	// スペースはファイル名としては有効だが何かとウザイので潰す
	newFilename = newFilename.replace(/ /g, after);
	return newFilename;
}

export { DateTimeUtil, fixInvalidFilename };
