# Documentação - API de Onboarding

Este documento descreve como os dados coletados no formulário de onboarding são estruturados e enviados ao backend.

## Endpoint

```
POST /api/onboarding
```

## Estrutura de Dados

### Campos Coletados

O formulário de onboarding coleta os seguintes dados do usuário:

| Campo              | Tipo      | Obrigatório | Descrição                            |
| ------------------ | --------- | ----------- | ------------------------------------ |
| `occupation`       | `string`  | Sim         | Categoria profissional do usuário    |
| `occupationDetail` | `string`  | Não         | Especificação da função ou atividade |
| `gender`           | `string`  | Sim         | Gênero do usuário                    |
| `race`             | `string`  | Sim         | Raça/Cor do usuário                  |
| `state`            | `string`  | Sim         | Sigla do estado (UF) onde mora       |
| `alertUrgent`      | `boolean` | Não         | Ativar alertas urgentes              |
| `alertPolls`       | `boolean` | Não         | Ativar enquetes rápidas              |
| `phone`            | `string`  | Sim         | Número de WhatsApp (DDD + Número)    |

### Valores Possíveis

#### Occupation

- `"Trabalhador de app"` - Motoristas e entregadores de aplicativos
- `"Funcionário Público"` - Servidores públicos (policiais, professores, etc.)
- `"Autônomo"` - Trabalhadores autônomos (pedreiros, vendedores, etc.)
- `"CLT"` - Trabalhadores com carteira assinada
- `"Estudante"` - Estudantes e bolsistas
- `"MEI"` - Microempreendedores individuais

#### Gender

- `"Mulher"`
- `"Homem"`
- `"Outro"`

#### Race

- `"Branca"`
- `"Negra/Parda"`
- `"Indígena"`
- `"Amarela"`
- `"Prefiro não responder"`

#### State

Sigla de 2 letras dos estados brasileiros: `AC`, `AL`, `AP`, `AM`, `BA`, `CE`, `DF`, `ES`, `GO`, `MA`, `MT`, `MS`, `MG`, `PA`, `PB`, `PR`, `PE`, `PI`, `RJ`, `RN`, `RS`, `RO`, `RR`, `SC`, `SP`, `SE`, `TO`

## Exemplo de Request

### Payload JSON

```json
{
  "occupation": "CLT",
  "occupationDetail": "Programador",
  "gender": "Homem",
  "race": "Negra/Parda",
  "state": "SP",
  "alertUrgent": true,
  "alertPolls": false,
  "phone": "(11) 99999-9999"
}
```

### Headers

```http
POST /api/onboarding HTTP/1.1
Content-Type: application/json
Authorization: Bearer {token}  (se aplicável)
```

## Exemplo de Response

### Sucesso (200 OK)

```json
{
  "success": true,
  "message": "Perfil criado com sucesso",
  "userId": "abc123",
  "profile": {
    "occupation": "CLT",
    "occupationDetail": "Programador",
    "gender": "Homem",
    "race": "Negra/Parda",
    "state": "SP",
    "alertUrgent": true,
    "alertPolls": false,
    "phone": "(11) 99999-9999"
  }
}
```

### Erro de Validação (400 Bad Request)

```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": {
    "phone": "Número de telefone inválido",
    "state": "Estado inválido"
  }
}
```

### Erro do Servidor (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Erro interno do servidor",
  "error": "Descrição do erro"
}
```

## Validações Necessárias no Backend

### Campos Obrigatórios

- `occupation` - não pode ser vazio
- `gender` - não pode ser vazio
- `race` - não pode ser vazio
- `state` - deve ser uma UF válida
- `phone` - deve ter no mínimo 8 caracteres

### Validações de Formato

- `state` - deve ser exatamente 2 caracteres (sigla válida)
- `phone` - deve seguir o formato brasileiro de telefone
- `occupation` - deve ser um dos valores permitidos
- `gender` - deve ser um dos valores permitidos
- `race` - deve ser um dos valores permitidos

### Validações de Negócio

- Se `alertUrgent` ou `alertPolls` forem `true`, o `phone` é obrigatório
- `occupationDetail` é opcional mas recomendado para melhor personalização

## Implementação no Frontend

### Localização do Código

O código de envio está em: `/src/pages/OnboardingPage.jsx`

### Função de Submit

```javascript
const handleSubmit = async () => {
  setIsSubmitting(true);
  setLoadingMessage("Salvando suas preferências...");

  const userProfile = {
    occupation: formData.occupation,
    occupationDetail: formData.occupationDetail,
    gender: formData.gender,
    race: formData.race,
    state: formData.state,
    alertUrgent: formData.alertUrgent,
    alertPolls: formData.alertPolls,
    phone: formData.phone,
  };

  // Salva no localStorage para uso no chat
  localStorage.setItem("userProfile", JSON.stringify(userProfile));

  // TODO: Substituir pelo endpoint real
  // await api.post('/api/onboarding', userProfile);

  // Simulação de API call
  setTimeout(() => {
    navigate("/chat");
  }, 3000);
};
```

## Armazenamento Local

Atualmente, os dados também são salvos no `localStorage` com a chave `userProfile` para uso no chat enquanto o backend não está integrado.

### Estrutura no LocalStorage

```javascript
{
  "occupation": "CLT",
  "occupationDetail": "Programador",
  "gender": "Homem",
  "race": "Negra/Parda",
  "state": "SP"
}
```

> **Nota**: Apenas os campos `occupation`, `occupationDetail`, `gender`, `race` e `state` são salvos no localStorage. Os dados sensíveis como `phone` e preferências de alertas devem ser enviados apenas ao backend.

## Próximos Passos para Integração

1. **Criar serviço de API** em `/src/services/api.js`
2. **Implementar função de POST** para o endpoint `/api/onboarding`
3. **Tratar erros** e exibir mensagens apropriadas ao usuário
4. **Adicionar autenticação** se necessário
5. **Remover ou ajustar** o armazenamento em localStorage conforme necessário
6. **Implementar retry logic** em caso de falha na conexão
