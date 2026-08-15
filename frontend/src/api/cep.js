// Consulta de CEP via ViaCEP (base de dados dos Correios), usada para
// preencher o endereço de entrega automaticamente no checkout.
const CEP_ENDPOINT = 'https://viacep.com.br/ws';

// Remove todos os caracteres que não são algarismos.
export function onlyDigits(value) {
  return (value || '').replace(/\D/g, '');
}

// Limita e formata o CEP no padrão brasileiro 00000-000.
export function formatCep(value) {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
}

// Consulta o ViaCEP e normaliza o endereço retornado para o formulário.
export async function fetchAddressByCep(cep) {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos.');
  }

  let response;
  try {
    response = await fetch(`${CEP_ENDPOINT}/${digits}/json/`);
  } catch (err) {
    throw new Error('Não foi possível consultar o CEP. Verifique sua conexão.');
  }

  if (!response.ok) {
    throw new Error('Não foi possível consultar o CEP.');
  }

  const data = await response.json();
  if (data.erro) {
    throw new Error('CEP não encontrado.');
  }

  return {
    cep: formatCep(data.cep || digits),
    street: data.logradouro || '',
    neighborhood: data.bairro || '',
    city: data.localidade || '',
    state: data.uf || '',
  };
}
