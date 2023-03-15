'use client';

import classnames from 'classnames';
import { useCallback, useState } from 'react';
import * as classes from './ImageUploader.css.js';
import { UploadIcon } from './UploadIcon.jsx';

export interface ImageUploaderProps {
	value: string | null;
	onChange: (value: File | null) => void;
	className?: string;
	maxDimension?: number;
}

/**
 * Renders an image if one is already set, and allows either clicking
 * on the image to select a new one, or dragging a new image onto the
 * component to replace the existing one.
 */
export function ImageUploader({
	value,
	onChange: handleChange,
	maxDimension,
	...rest
}: ImageUploaderProps) {
	const [dragging, setDragging] = useState(false);
	const [draggingOver, setDraggingOver] = useState(false);

	const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDraggingOver(true);
	}, []);

	const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDraggingOver(false);
	}, []);

	const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDraggingOver(true);
	}, []);

	const onChange = useCallback(
		async (file: File | null) => {
			if (!file) {
				handleChange(null);
			} else if (maxDimension) {
				const { readAndCompressImage } = await import('browser-image-resizer');
				const resizedImage = await readAndCompressImage(file, {
					maxWidth: maxDimension,
					maxHeight: maxDimension,
					mimeType: file.type,
				});
				handleChange(new File([resizedImage], file.name, { type: file.type }));
			} else {
				handleChange(file);
			}
		},
		[handleChange, maxDimension],
	);

	const onDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setDraggingOver(false);
			if (e.dataTransfer.files.length > 0) {
				onChange(e.dataTransfer.files[0]);
			}
		},
		[onChange],
	);

	const onDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragging(true);
	}, []);

	const onDragEnd = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragging(false);
	}, []);

	const onFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.files && e.target.files.length > 0) {
				onChange(e.target.files[0]);
			}
		},
		[onChange],
	);

	const onFileClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
		e.stopPropagation();
	}, []);

	return (
		<div
			className={classnames(classes.imageUploader, rest.className)}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={onDrop}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
		>
			{value ? <img src={value} className={classes.image} /> : null}
			<input
				type="file"
				accept="image/*"
				onChange={onFileChange}
				onClick={onFileClick}
				className={classes.fileInput}
			/>
			<div
				className={classnames(
					classes.dragging,
					draggingOver && classes.draggingOver,
				)}
			>
				<UploadIcon className={classes.draggingIcon} />
				<div className={classes.draggingText}>
					{dragging ? 'Drop' : 'Tap'} to upload image
				</div>
			</div>
			{value && (
				<button className={classes.remove} onClick={() => onChange(null)}>
					✕
				</button>
			)}
		</div>
	);
}
