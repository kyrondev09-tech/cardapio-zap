<script lang="ts">
	import type { CartItem, Config, CustomerData } from '../types';
	import {
		formatMoney,
		calcItemSubtotal,
		calcCartSubtotal,
		calcDeliveryFee,
		calcOrderTotal
	} from '../utils/pricing';
	import { validateCustomerStep, isConfiguredWhatsAppValid } from '../utils/validation';
	import { buildWhatsAppMessage, getWhatsAppLink } from '../utils/whatsapp';
	import { dialog } from '../actions/dialog';

	interface CheckoutProps {
		cart: CartItem[];
		isDelivery: boolean;
		config: Config;
		isCurrentlyOpen: boolean;
		onClose: () => void;
		onToggleDelivery: (isDelivery: boolean) => void;
	}

	const STEP_LABELS = ['Recebimento', 'Seus dados', 'Revisão'] as const;
	const LAST_STEP = STEP_LABELS.length;

	let { cart, isDelivery, config, isCurrentlyOpen, onClose, onToggleDelivery }: CheckoutProps =
		$props();

	let checkoutStep = $state(1); // 1: Entrega/Retirada, 2: Dados, 3: Revisão

	// svelte-ignore state_referenced_locally
	let customer = $state<CustomerData>({
		name: '',
		phone: '',
		street: '',
		number: '',
		neighborhood: '',
		complement: '',
		reference: '',
		paymentMethod: config.paymentMethods[0] || 'Pix',
		changeFor: '',
		generalObservation: ''
	});

	let checkoutError = $state('');
	let copyStatus = $state<{ ok: boolean; text: string } | null>(null);
	let bodyEl = $state<HTMLElement | null>(null);

	let subtotal = $derived(calcCartSubtotal(cart));
	let finalDeliveryFee = $derived(calcDeliveryFee(isDelivery, config.deliveryFee));
	let total = $derived(calcOrderTotal(subtotal, finalDeliveryFee));

	// O aviso de erro fica no topo: garante que ele (e o início de cada etapa) esteja à vista
	function scrollBodyToTop() {
		bodyEl?.scrollTo({ top: 0 });
	}

	function failStep(message: string) {
		checkoutError = message;
		scrollBodyToTop();
	}

	function nextStep() {
		checkoutError = '';
		if (checkoutStep === 1) {
			checkoutStep = 2;
		} else if (checkoutStep === 2) {
			const validation = validateCustomerStep({
				customer,
				isDelivery,
				orderTotalCents: total
			});
			if (!validation.valid) {
				failStep(validation.error);
				return;
			}
			checkoutStep = 3;
		}
		scrollBodyToTop();
	}

	function prevStep() {
		checkoutError = '';
		copyStatus = null;
		if (checkoutStep > 1) {
			checkoutStep--;
			scrollBodyToTop();
		}
	}

	function createOrderMessage(): string {
		return buildWhatsAppMessage({
			config,
			customer,
			cart,
			isDelivery,
			subtotal,
			deliveryFee: finalDeliveryFee,
			total
		});
	}

	function finalizeOrder() {
		checkoutError = '';
		if (!isConfiguredWhatsAppValid(config.whatsapp)) {
			failStep(
				'O WhatsApp da loja não está configurado corretamente. Não é possível enviar o pedido.'
			);
			return;
		}

		const msg = createOrderMessage();
		const link = getWhatsAppLink(config.whatsapp, msg);
		window.open(link, '_blank');
	}

	function copyMessage() {
		const msg = createOrderMessage();
		const failure = {
			ok: false,
			text: 'Falha ao copiar mensagem. Selecione e copie manualmente se necessário.'
		};
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard
				.writeText(msg)
				.then(() => {
					copyStatus = { ok: true, text: 'Mensagem copiada! Você pode colar no seu WhatsApp.' };
				})
				.catch(() => {
					copyStatus = failure;
				});
		} else {
			copyStatus = failure;
		}
	}
</script>

<div class="modal-backdrop" onclick={onClose} role="presentation"></div>

<div
	class="modal checkout-modal"
	role="dialog"
	aria-modal="true"
	aria-labelledby="checkout-title"
	use:dialog={{ onClose }}
>
	<div class="checkout-header">
		{#if checkoutStep > 1}
			<button type="button" class="icon-btn" onclick={prevStep} aria-label="Voltar">
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
					<line x1="19" y1="12" x2="5" y2="12"></line>
					<polyline points="12 19 5 12 12 5"></polyline>
				</svg>
			</button>
		{:else}
			<div class="spacer"></div>
		{/if}
		<h3 id="checkout-title" class="display">Finalizar Pedido</h3>
		<button type="button" class="icon-btn" onclick={onClose} aria-label="Fechar">
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
	</div>

	<div class="steps">
		<ol aria-hidden="true">
			{#each STEP_LABELS as label, index (label)}
				<li class={index + 1 < checkoutStep ? 'done' : index + 1 === checkoutStep ? 'current' : ''}>
					<span class="step-bar"></span>
					<span class="step-label">{label}</span>
				</li>
			{/each}
		</ol>
		<p class="sr-only" aria-live="polite">
			Etapa {checkoutStep} de {STEP_LABELS.length}: {STEP_LABELS[checkoutStep - 1]}
		</p>
	</div>

	<div class="checkout-body" bind:this={bodyEl}>
		{#if checkoutError}
			<div class="error-banner" role="alert">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<line x1="12" y1="8" x2="12" y2="12"></line>
					<line x1="12" y1="16" x2="12.01" y2="16"></line>
				</svg>
				<span>{checkoutError}</span>
			</div>
		{/if}

		{#if !isCurrentlyOpen}
			<p class="closed-notice">
				Estamos fechados no momento. Você pode enviar o pedido mesmo assim: ele será confirmado pelo
				WhatsApp quando a loja abrir.
			</p>
		{/if}

		{#if checkoutStep === 1}
			<div class="step-content">
				<h4>Como deseja receber?</h4>
				<div class="receive-options" role="group" aria-label="Forma de recebimento">
					<button type="button" aria-pressed={isDelivery} onclick={() => onToggleDelivery(true)}>
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.75"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<rect x="1" y="3" width="15" height="13"></rect>
							<polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
							<circle cx="5.5" cy="18.5" r="2.5"></circle>
							<circle cx="18.5" cy="18.5" r="2.5"></circle>
						</svg>
						<span class="title">Entrega</span>
						<span class="sub">Taxa de {formatMoney(config.deliveryFee)}</span>
					</button>
					<button type="button" aria-pressed={!isDelivery} onclick={() => onToggleDelivery(false)}>
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.75"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
							<line x1="3" y1="6" x2="21" y2="6"></line>
							<path d="M16 10a4 4 0 0 1-8 0"></path>
						</svg>
						<span class="title">Retirada</span>
						<span class="sub">{config.address}</span>
					</button>
				</div>
			</div>
		{:else if checkoutStep === 2}
			<div class="step-content form-step">
				<h4>Seus dados</h4>
				<label class="field">
					Nome*
					<input
						class="control"
						type="text"
						autocomplete="name"
						bind:value={customer.name}
						placeholder="Como quer ser chamado?"
						required
					/>
				</label>
				<label class="field">
					Celular (WhatsApp)*
					<input
						class="control"
						type="tel"
						autocomplete="tel"
						bind:value={customer.phone}
						placeholder="(00) 00000-0000"
						required
					/>
				</label>

				{#if isDelivery}
					<h4>Endereço de entrega</h4>
					<div class="form-row multi">
						<label class="field flex-3">
							Rua/Avenida*
							<input
								class="control"
								type="text"
								autocomplete="address-line1"
								bind:value={customer.street}
								required
							/>
						</label>
						<label class="field flex-1">
							Número*
							<input
								class="control"
								type="text"
								bind:value={customer.number}
								placeholder="Ou S/N"
								required
							/>
						</label>
					</div>
					<label class="field">
						Bairro*
						<input class="control" type="text" bind:value={customer.neighborhood} required />
					</label>
					<label class="field">
						Complemento
						<input
							class="control"
							type="text"
							bind:value={customer.complement}
							placeholder="Apto, Bloco, Casa 2..."
						/>
					</label>
					<label class="field">
						Ponto de Referência
						<input class="control" type="text" bind:value={customer.reference} />
					</label>
				{/if}

				<h4 id="payment-title">
					Pagamento (No momento da {isDelivery ? 'entrega' : 'retirada'})
				</h4>
				<div class="field">
					<select
						class="control"
						bind:value={customer.paymentMethod}
						aria-labelledby="payment-title"
					>
						{#each config.paymentMethods as pm (pm)}
							<option value={pm}>{pm}</option>
						{/each}
					</select>
				</div>

				{#if customer.paymentMethod === 'Dinheiro'}
					<label class="field">
						Troco para quanto? (Deixe em branco se não precisar)
						<input
							class="control"
							type="text"
							inputmode="decimal"
							bind:value={customer.changeFor}
							placeholder="Ex: 50,00"
						/>
					</label>
				{/if}

				<label class="field">
					Observação geral do pedido (Opcional)
					<textarea class="control" bind:value={customer.generalObservation} rows="2"></textarea>
				</label>
			</div>
		{:else if checkoutStep === 3}
			<div class="step-content review-step">
				<h4>Revisão do Pedido</h4>

				<dl class="review-section">
					<div>
						<dt>Cliente</dt>
						<dd>{customer.name} ({customer.phone})</dd>
					</div>
					<div>
						<dt>Tipo</dt>
						<dd>{isDelivery ? 'Entrega' : 'Retirada'}</dd>
					</div>
					{#if isCurrentlyOpen}
						<div>
							<dt>Preparo</dt>
							<dd>Cerca de {config.prepTime} min</dd>
						</div>
					{/if}
					{#if isDelivery}
						<div>
							<dt>Endereço</dt>
							<dd>{customer.street}, {customer.number} - {customer.neighborhood}</dd>
						</div>
					{/if}
				</dl>

				<div class="review-items">
					{#each cart as item (item.id)}
						{@const itemTotal = calcItemSubtotal(item)}
						<div class="rev-entry">
							<div class="rev-item">
								<span>{item.quantity}x {item.name}</span>
								<span>{formatMoney(itemTotal)}</span>
							</div>
							{#if item.selectedOptions.length > 0}
								<div class="rev-sub">
									{item.selectedOptions.map((o) => o.optionName).join(', ')}
								</div>
							{/if}
							{#if item.observation}
								<div class="rev-sub">Obs: {item.observation}</div>
							{/if}
						</div>
					{/each}
				</div>

				<div class="review-totals">
					<div class="row">
						<span>Subtotal</span>
						<span>{formatMoney(subtotal)}</span>
					</div>
					{#if isDelivery}
						<div class="row">
							<span>Taxa de entrega</span>
							<span>{formatMoney(finalDeliveryFee)}</span>
						</div>
					{/if}
					<div class="row total">
						<span>Total a pagar</span>
						<span>{formatMoney(total)}</span>
					</div>
					<div class="payment-info">
						Pagamento em <strong>{customer.paymentMethod}</strong>
						{#if customer.paymentMethod === 'Dinheiro' && customer.changeFor}
							(Troco para R$ {customer.changeFor})
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="checkout-footer">
		{#if checkoutStep < LAST_STEP}
			<button type="button" class="btn btn-primary btn-block" onclick={nextStep}>
				Continuar
			</button>
		{:else}
			<button type="button" class="btn btn-whatsapp btn-block" onclick={finalizeOrder}>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path
						d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
					/>
				</svg>
				Enviar pedido pelo WhatsApp
			</button>
			<button type="button" class="btn btn-text" onclick={copyMessage}>Copiar mensagem</button>
			<p class="copy-status {copyStatus?.ok === false ? 'failed' : ''}" role="status">
				{copyStatus?.text ?? ''}
			</p>
		{/if}
	</div>
</div>

<style>
	.checkout-modal {
		max-width: 600px;
	}

	.checkout-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 12px;
	}

	.checkout-header h3 {
		font-size: 1.25rem;
	}

	.spacer {
		width: 44px;
		height: 44px;
	}

	/* Indicador de etapas */
	.steps {
		padding: 0 20px 14px;
		border-bottom: 1px solid var(--border);
	}

	.steps ol {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.step-bar {
		display: block;
		height: 4px;
		border-radius: 999px;
		background: var(--surface-3);
		transition: background-color 0.3s;
	}

	.step-label {
		display: block;
		margin-top: 6px;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.steps li.done .step-bar,
	.steps li.current .step-bar {
		background: var(--accent);
	}

	.steps li.done .step-label {
		color: var(--text-light);
	}

	.steps li.current .step-label {
		color: var(--accent-text);
	}

	.checkout-body {
		padding: 24px 20px;
		overflow-y: auto;
		overscroll-behavior: contain;
		flex: 1;
		min-height: 0;
	}

	.checkout-footer {
		padding: 16px 20px;
		padding-bottom: calc(16px + env(safe-area-inset-bottom));
		border-top: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.step-content {
		animation: rise 0.3s var(--ease) both;
	}

	.step-content h4 {
		font-size: 1.1rem;
		font-weight: 700;
		margin-bottom: 16px;
	}

	.step-content h4:not(:first-child) {
		margin-top: 28px;
	}

	/* Etapa 1: Entrega / Retirada */
	.receive-options {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}

	.receive-options button {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 24px 12px;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		color: var(--text-light);
		text-align: center;
		transition:
			border-color 0.2s,
			background-color 0.2s,
			color 0.2s;
	}

	.receive-options button[aria-pressed='true'] {
		border-color: var(--accent);
		background: var(--accent-soft);
		color: var(--accent);
	}

	.receive-options .title {
		margin-top: 4px;
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text);
	}

	.receive-options .sub {
		font-size: 0.85rem;
		color: var(--text-light);
	}

	/* Campos */
	.field {
		display: block;
		margin-bottom: 16px;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-light);
	}

	.field .control {
		margin-top: 6px;
		font-weight: 400;
	}

	div.field .control {
		margin-top: 0;
	}

	.form-row.multi {
		display: flex;
		gap: 12px;
	}

	.flex-3 {
		flex: 3;
		min-width: 0;
	}

	.flex-1 {
		flex: 1;
		min-width: 92px;
	}

	/* Etapa 3: Revisão */
	.review-section {
		display: grid;
		gap: 10px;
		margin: 0 0 20px;
		padding: 16px;
		background: var(--surface-2);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		font-size: 0.95rem;
	}

	.review-section div {
		display: grid;
		grid-template-columns: 84px minmax(0, 1fr);
		gap: 12px;
	}

	.review-section dt {
		color: var(--text-muted);
	}

	.review-section dd {
		margin: 0;
		font-weight: 600;
		overflow-wrap: anywhere;
	}

	.review-items {
		margin-bottom: 16px;
	}

	.rev-entry {
		padding: 10px 0;
		border-bottom: 1px solid var(--border);
	}

	.rev-item {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.rev-item span:last-child {
		flex: none;
	}

	.rev-sub {
		font-size: 0.85rem;
		color: var(--text-light);
		margin-top: 2px;
	}

	.review-totals .row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
		color: var(--text-light);
		font-variant-numeric: tabular-nums;
	}

	.review-totals .total {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text);
		border-top: 1px dashed var(--border-strong);
		padding-top: 14px;
		margin-top: 8px;
	}

	.review-totals .total span:last-child {
		color: var(--accent-text);
	}

	.payment-info {
		background: var(--surface-2);
		border: 1px solid var(--border);
		padding: 12px;
		border-radius: var(--radius-sm);
		margin-top: 16px;
		text-align: center;
		font-size: 0.9rem;
		color: var(--text-light);
	}

	.payment-info strong {
		color: var(--text);
	}

	/* Mensagens */
	.error-banner {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		background: var(--error-bg);
		border: 1px solid var(--error-line);
		color: var(--error);
		padding: 12px 14px;
		border-radius: var(--radius-sm);
		margin-bottom: 20px;
		font-weight: 600;
		font-size: 0.9rem;
		animation: rise 0.25s var(--ease) both;
	}

	.error-banner svg {
		flex: none;
		margin-top: 1px;
	}

	.closed-notice {
		margin-bottom: 20px;
		padding: 12px 14px;
		background: var(--surface-2);
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-sm);
		color: var(--text-light);
		font-size: 0.9rem;
	}

	.copy-status {
		font-size: 0.85rem;
		text-align: center;
		color: var(--success);
	}

	.copy-status.failed {
		color: var(--error);
	}

	.copy-status:empty {
		display: none;
	}

	@media (hover: hover) {
		.receive-options button[aria-pressed='false']:hover {
			border-color: var(--border-strong);
		}
	}

	@media (max-width: 768px) {
		.checkout-modal {
			max-width: 100%;
		}

		.checkout-body {
			padding: 20px 16px;
		}

		.steps,
		.checkout-footer {
			padding-left: 16px;
			padding-right: 16px;
		}
	}
</style>
