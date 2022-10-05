/**
 * High-level patch creation for use with complex nested objects.
 */

import { createRef, createSubOid, ObjectIdentifier } from './oids.js';
import {
	diffToPatches,
	initialToPatches,
	ObjectRef,
	OperationPatch,
	OperationPatchListInsert,
	OperationPatchListPush,
	OperationPatchListRemove,
	OperationPatchSet,
	PropertyName,
	PropertyValue,
} from './operation.js';
import { isObject } from './utils.js';

export class PatchCreator {
	constructor(
		private getNow: () => string,
		private createSubId?: () => string,
	) {}

	createDiff = (from: any, to: any) => {
		return diffToPatches(from, to, this.getNow, this.createSubId);
	};

	createInitialize = (obj: any, oid: ObjectIdentifier) => {
		return initialToPatches(obj, oid, this.getNow, this.createSubId);
	};

	createSet = (
		oid: ObjectIdentifier,
		key: PropertyName,
		value: any,
	): OperationPatch[] => {
		// incoming value must be normalized. if it's not a primitive, it and all sub-objects
		// must be created
		if (!isObject(value)) {
			return [
				{
					op: 'set',
					oid,
					name: key,
					value,
					timestamp: this.getNow(),
				},
			];
		} else {
			const itemOid = createSubOid(oid, this.createSubId);
			return [
				// since we're setting a complex nested object, we can initialize it wholesale.
				// no diffing to do.
				...initialToPatches(value, itemOid, this.getNow),
				// then set the reference to the object
				{
					op: 'set',
					oid,
					name: key,
					value: createRef(itemOid),
					timestamp: this.getNow(),
				},
			];
		}
	};

	createRemove = (
		oid: ObjectIdentifier,
		key: PropertyName,
	): OperationPatch[] => {
		return [
			{
				op: 'remove',
				oid,
				name: key,
				timestamp: this.getNow(),
			},
		];
	};

	createListPush = (oid: ObjectIdentifier, value: any): OperationPatch[] => {
		if (!isObject(value)) {
			return [
				{
					op: 'list-push',
					value,
					oid,
					timestamp: this.getNow(),
				},
			];
		} else {
			const itemOid = createSubOid(oid, this.createSubId);
			return [
				...initialToPatches(value, itemOid, this.getNow),
				{
					op: 'list-push',
					value: createRef(itemOid),
					oid,
					timestamp: this.getNow(),
				},
			];
		}
	};

	createListInsert = (
		oid: ObjectIdentifier,
		index: number,
		value: any,
	): OperationPatch[] => {
		if (!isObject(value)) {
			return [
				{
					op: 'list-insert',
					value,
					oid,
					index,
					timestamp: this.getNow(),
				},
			];
		} else {
			const itemOid = createSubOid(oid, this.createSubId);
			return [
				...initialToPatches(value, itemOid, this.getNow),
				{
					op: 'list-insert',
					value: createRef(itemOid),
					oid,
					index,
					timestamp: this.getNow(),
				},
			];
		}
	};

	createListRemove = (oid: ObjectIdentifier, value: any): OperationPatch[] => {
		return [
			{
				op: 'list-remove',
				oid,
				value,
				timestamp: this.getNow(),
			},
		];
	};

	createListDelete = (
		oid: ObjectIdentifier,
		index: number,
		count: number = 1,
	): OperationPatch[] => {
		return [
			{
				op: 'list-delete',
				oid,
				index,
				count,
				timestamp: this.getNow(),
			},
		];
	};

	createListMoveByRef = (
		oid: ObjectIdentifier,
		value: ObjectRef,
		index: number,
	): OperationPatch[] => {
		return [
			{
				op: 'list-move-by-ref',
				oid,
				value,
				index,
				timestamp: this.getNow(),
			},
		];
	};

	createListMoveByIndex = (
		oid: ObjectIdentifier,
		fromIndex: number,
		toIndex: number,
	): OperationPatch[] => {
		return [
			{
				op: 'list-move-by-index',
				oid,
				from: fromIndex,
				to: toIndex,
				timestamp: this.getNow(),
			},
		];
	};

	createDelete = (oid: ObjectIdentifier): OperationPatch[] => {
		return [
			{
				op: 'delete',
				oid,
				timestamp: this.getNow(),
			},
		];
	};
}
