import multer from 'multer';

const storage = multer.diskStorage({
	destination: 'uploads',
	filename: function (req, file, next) {
		next(null, file.originalname)
	},
})

export const uploads = multer({storage: storage})
