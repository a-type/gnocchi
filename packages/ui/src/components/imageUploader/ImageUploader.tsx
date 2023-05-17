'use client';

import classNames from 'classnames';
import { useCallback, useState } from 'react';
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
			className={classNames('relative overflow-hidden', rest.className)}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={onDrop}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
		>
			{value ? (
				<img src={value} className="w-full h-full object-cover object-center" />
			) : null}
			<input
				type="file"
				accept="image/*"
				onChange={onFileChange}
				onClick={onFileClick}
				className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
			/>
			<div
				className={classNames(
					'bg-[rgba(30,20,0,0.1)] flex flex-col items-center justify-center w-full h-full absolute inset-0 gap-3 pointer-events-none',
					draggingOver && 'bg-[rgba(0,0,0,0.2)]',
				)}
			>
				<UploadIcon className="w-50px h-50px color-white" />
				<div className="color-white">
					{dragging ? 'Drop' : 'Tap'} to upload image
				</div>
			</div>
			{value && (
				<button
					className="absolute top-2 right-2 w-32px h-32px border-none p-2 cursor-pointer bg-white color-black rounded-full transition-colors shadow-sm hover:bg-gray2"
					onClick={() => onChange(null)}
				>
					✕
				</button>
			)}
		</div>
	);
}
