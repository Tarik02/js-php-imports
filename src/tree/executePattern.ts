import { Modifier, Path } from '../types'

import { TreeUseItem, TreeUseNamespace } from '.'


export default function* executePattern(
	node: TreeUseNamespace,
	pattern: Path,
	modifiers: readonly Modifier[] = [],
): Generator<TreeUseItem> {
	switch (pattern[0]) {
	case '*':
		for (const namespace of node.namespaces.values()) {
			yield* executePattern(
				namespace,
				pattern.slice(1),
				modifiers,
			)
		}
		break

	case '**':
		for (const item of node.namespaces.values()) {
			yield* executePattern(
				item,
				['**'],
				modifiers,
			)
		}

		for (const item of node.items.values()) {
			if (modifiers.length === 0 || modifiers.some(it => it === item.modifier)) {
				yield item
			}
		}
		break

	default:
		const item = node.namespaces.get(pattern[0])
		if (item) {
			yield* executePattern(
				item,
				pattern.slice(1),
				modifiers,
			)
		}
		break
	}
}
