<script lang="ts">
	import type { Product, ProductModalConfirmData, SelectedOption } from '../types';
	import { formatMoney, calcModalPrice } from '../utils/pricing';
	import { isProductModalValid } from '../utils/validation';
	import { onImageError } from '../utils/image';
	import { dialog } from '../actions/dialog';

	interface ProductModalProps {
		product: Product;
		initialSelections?: Record<string, string[]>;
		initialObservation?: string;
		initialQty?: number;
		maxItemQty?: number;
		onClose: () => void;
		onConfirm: (data: ProductModalConfirmData) => void;
	}

	let {
		product,
		initialSelections = {},
		initialObservation = '',
		initialQty = 1,
		maxItemQty = 20,
		onClose,
		onConfirm
	}: ProductModalProps = $props();

	// Inicializa seleções com defaults obrigatórios (se não for edição)
	function initSelections(): Record<string, string[]> {
		const initial: Record<string, string[]> = {};
		if (product.optionGroups) {
			for (const group of product.optionGroups) {
				if (initialSelections[group.id]?.length) {
					initial[group.id] = [...initialSelections[group.id]];
				} else if (group.min === 1 && group.max === 1 && group.options.length > 0) {
					initial[group.id] = [group.options[0].id];
				} else {
					initial[group.id] = [];
				}
			}
		}
		return initial;
	}

	let modalSelections = $state<Record<string, string[]>>(initSelections());
	// svelte-ignore state_referenced_locally
	let modalObservation = $state(initialObservation);
	// svelte-ignore state_referenced_locally
	let modalQty = $state(initialQty);

	let currentPrice = $derived(calcModalPrice(product, modalSelections, modalQty));
	let isValid = $derived(isProductModalValid(product, modalSelections));

	function toggleOption(groupId: string, optionId: string, max: number) {
		const current = modalSelections[groupId] || [];
		if (max === 1) {
			modalSelections[groupId] = [optionId];
		} else {
			if (current.includes(optionId)) {
				modalSelections[groupId] = current.filter((id) => id !== optionId);
			} else if (current.length < max) {
				modalSelections[groupId] = [...current, optionId];
			}
		}
	}

	function handleConfirm() {
		if (!isValid) return;

		const selectedOpts: SelectedOption[] = [];
		if (product.optionGroups) {
			for (const group of product.optionGroups) {
				const ids = modalSelections[group.id] || [];
				for (const id of ids) {
					const opt = group.options.find((o) => o.id === id);
					if (opt) {
						selectedOpts.push({
							groupId: group.id,
							groupName: group.name,
							optionId: opt.id,
							optionName: opt.name,
							priceAddition: opt.priceAddition
						});
					}
				}
			}
		}

		selectedOpts.sort((a, b) => a.optionId.localeCompare(b.optionId));

		onConfirm({
			selections: selectedOpts,
			observation: modalObservation.trim(),
			quantity: modalQty
		});
	}
</script>

<div class="modal-backdrop" onclick={onClose} role="presentation"></div>

<div
	class="modal product-modal"
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-prod-name"
	use:dialog={{ onClose }}
>
	<button type="button" class="floating-close" onclick={onClose} aria-label="Fechar">
		<svg
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<line x1="18" y1="6" x2="6" y2="18"></line>
			<line x1="6" y1="6" x2="18" y2="18"></line>
		</svg>
	</button>

	<div class="modal-scroll">
		<div class="modal-header-img">
			<img src={product.imageUrl} alt={product.name} onerror={onImageError} />
		</div>

		<div class="modal-body">
			<h2 id="modal-prod-name" class="display">{product.name}</h2>
			<p class="desc">{product.description}</p>
			<p class="base-price">{formatMoney(product.basePrice)}</p>

			{#if product.optionGroups}
				{#each product.optionGroups as group (group.id)}
					<fieldset class="option-group">
						<legend class="group-header">
							<span class="group-name">{group.name}</span>
							<span class="group-rules">
								{group.min === group.max
									? `Escolha ${group.min}`
									: group.min === 0
										? `Até ${group.max}`
										: `De ${group.min} a ${group.max}`}
							</span>
						</legend>

						<div class="options-list">
							{#each group.options as opt (opt.id)}
								{@const isSelected = (modalSelections[group.id] || []).includes(opt.id)}
								{@const isDisabled =
									!isSelected &&
									group.max > 1 &&
									(modalSelections[group.id] || []).length >= group.max}

								<label
									class="option-row {isSelected ? 'selected' : ''} {isDisabled ? 'disabled' : ''}"
								>
									<div class="opt-info">
										<span class="opt-name">{opt.name}</span>
										{#if opt.priceAddition > 0}
											<span class="opt-price">+ {formatMoney(opt.priceAddition)}</span>
										{/if}
									</div>
									<div class="opt-control">
										{#if group.max === 1}
											<input
												type="radio"
												name={group.id}
												checked={isSelected}
												disabled={isDisabled}
												onchange={() => toggleOption(group.id, opt.id, group.max)}
											/>
										{:else}
											<input
												type="checkbox"
												checked={isSelected}
												disabled={isDisabled}
												onchange={() => toggleOption(group.id, opt.id, group.max)}
											/>
										{/if}
									</div>
								</label>
							{/each}
						</div>
					</fieldset>
				{/each}
			{/if}

			<div class="option-group">
				<label class="group-name" for="modal-prod-obs">Alguma observação?</label>
				<textarea
					id="modal-prod-obs"
					class="control"
					placeholder="Ex: Tirar cebola, ponto da carne..."
					bind:value={modalObservation}
					rows="2"></textarea>
			</div>
		</div>
	</div>

	<div class="modal-footer">
		<div class="qty-control large">
			<button
				type="button"
				onclick={() => (modalQty = Math.max(1, modalQty - 1))}
				aria-label="Diminuir quantidade"
			>
				−
			</button>
			<span aria-live="polite">{modalQty}</span>
			<button
				type="button"
				onclick={() => (modalQty = Math.min(maxItemQty, modalQty + 1))}
				aria-label="Aumentar quantidade"
			>
				+
			</button>
		</div>
		<button
			type="button"
			class="btn btn-primary btn-block"
			onclick={handleConfirm}
			disabled={!isValid}
		>
			Adicionar • {formatMoney(currentPrice)}
		</button>
	</div>
</div>

<style>
	.product-modal {
		max-width: 500px;
	}

	.floating-close {
		position: absolute;
		top: 12px;
		right: 12px;
		z-index: 10;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(18, 17, 16, 0.78);
		border: 1px solid var(--border-strong);
		color: var(--text);
		backdrop-filter: blur(4px);
		transition: background-color 0.2s;
	}

	/* Foto e opções rolam juntas; o rodapé com o botão fica sempre visível */
	.modal-scroll {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.modal-header-img {
		aspect-ratio: 16 / 9;
		max-height: 240px;
		width: 100%;
		background: var(--surface-2);
	}

	.modal-header-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.modal-body {
		padding: 24px;
	}

	.modal-body h2 {
		font-size: 1.6rem;
		margin-bottom: 8px;
	}

	.modal-body .desc {
		color: var(--text-light);
		margin-bottom: 12px;
	}

	.modal-body .base-price {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--accent-text);
		font-variant-numeric: tabular-nums;
		margin-bottom: 24px;
	}

	.option-group {
		min-width: 0;
		margin: 0 0 24px;
		padding: 0;
		border: none;
	}

	.option-group:last-child {
		margin-bottom: 0;
	}

	.group-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 0 0 10px;
	}

	.group-name {
		display: block;
		font-size: 1.05rem;
		font-weight: 700;
	}

	label.group-name {
		margin-bottom: 10px;
	}

	.group-rules {
		flex: none;
		font-size: 0.75rem;
		background: var(--accent-soft);
		padding: 3px 10px;
		border-radius: 999px;
		color: var(--accent-text);
		font-weight: 700;
	}

	.options-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.option-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		min-height: 52px;
		padding: 10px 14px;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition:
			border-color 0.2s,
			background-color 0.2s;
	}

	.option-row.selected {
		border-color: var(--accent-line);
		background: var(--accent-soft);
	}

	.option-row.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.option-row:has(input:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.opt-info {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.opt-name {
		font-weight: 600;
	}

	.opt-price {
		font-size: 0.85rem;
		color: var(--accent-text);
		font-variant-numeric: tabular-nums;
	}

	.opt-control {
		display: flex;
	}

	.opt-control input {
		width: 22px;
		height: 22px;
		accent-color: var(--accent);
		cursor: inherit;
	}

	.opt-control input:focus-visible {
		outline: none;
	}

	.modal-footer {
		padding: 16px 24px;
		padding-bottom: calc(16px + env(safe-area-inset-bottom));
		border-top: 1px solid var(--border);
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--surface);
	}

	@media (hover: hover) {
		.floating-close:hover {
			background: var(--surface-3);
		}

		.option-row:not(.disabled, .selected):hover {
			border-color: var(--border-strong);
		}
	}

	@media (max-width: 768px) {
		.product-modal {
			max-width: 100%;
		}

		.modal-header-img {
			max-height: 220px;
		}

		.modal-body {
			padding: 20px 16px;
		}

		.modal-footer {
			padding-left: 16px;
			padding-right: 16px;
		}
	}

	@media (max-width: 380px) {
		.modal-footer .btn {
			padding-left: 12px;
			padding-right: 12px;
			font-size: 0.95rem;
		}
	}
</style>
