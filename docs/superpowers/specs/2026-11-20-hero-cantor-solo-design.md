# Hero principal com cantor isolado

## Objetivo

Criar uma nova imagem exclusiva para o primeiro slide da hero principal, removendo os dois músicos e todos os equipamentos associados que aparecem atrás de Serginho Barbosa. O cantor deve permanecer exatamente igual ao arquivo original, sem regeneração do rosto, corpo, roupa, mãos, microfone ou pedestal.

## Fonte e escopo

- Fonte: `public/sites/serginho-barbosa/editorial/biografia-show.webp`.
- Dimensões de referência: `3448 × 2299`.
- A imagem original permanece intacta porque também é usada na página Biografia.
- A edição será salva como um novo WebP dedicado à home.
- O CSS, o enquadramento, os gradientes, o `object-position`, os textos e os controles da hero permanecem inalterados.

## Tratamento visual

- Preservar integralmente os pixels do cantor, do microfone e do pedestal.
- Remover tecladista, percussionista, teclado, percussão, bancos, suportes e cabos diretamente associados a esses músicos.
- Reconstruir somente as áreas removidas com continuidade natural da cortina, do palco e da atmosfera azul e roxa.
- Manter direção, intensidade e temperatura da iluminação, sombras do palco, contraste, granulação e profundidade existentes.
- Não introduzir novas pessoas, instrumentos, objetos, texto, logotipos ou efeitos de luz.
- Não alterar o enquadramento nem recortar partes do cantor.

## Integração

- Criar um asset dedicado, com nome descritivo, dentro de `public/sites/serginho-barbosa/editorial/`.
- Alterar apenas o caminho da imagem do primeiro slide em `hero-carousel.tsx`.
- Gerar a miniatura `hero-thumbs/palco.webp` a partir da imagem aprovada, mantendo `96 × 96`.
- Preservar o arquivo `biografia-show.webp` e seu uso na página Biografia.

## Qualidade e peso

- Manter resolução suficiente para exibição nítida em telas desktop e retina, sem ampliar artificialmente uma saída pequena.
- Exportar em WebP sRGB, sem metadados desnecessários.
- Buscar peso igual ou inferior ao original de 509.698 bytes sem artefatos visíveis no cantor ou nas áreas reconstruídas.
- Se a ferramenta de edição não devolver resolução adequada, a saída não será integrada; será refeita por outra variação.

## Verificação

- Comparar original e editada lado a lado, com atenção ao contorno do cantor, mãos, cabelo, roupa, microfone e pedestal.
- Verificar que o cantor permanece idêntico e que não há resíduos dos músicos ou equipamentos.
- Conferir continuidade da cortina, luz e piso em zoom de 100%.
- Validar a hero localmente em desktop e mobile, incluindo os recortes existentes.
- Confirmar que a Biografia continua usando a foto original.
- Adicionar teste para proteger o novo caminho da hero e a preservação do asset da Biografia.

## Critérios de aceitação

1. Apenas Serginho Barbosa permanece em cena como pessoa.
2. Cantor, microfone e pedestal não apresentam alteração perceptível em relação ao original.
3. Músicos e equipamentos associados desaparecem por completo.
4. Fundo reconstruído preserva a mesma iluminação azul e roxa e parece pertencer à fotografia original.
5. A hero mantém o mesmo layout em desktop e mobile.
6. A imagem original da Biografia não é sobrescrita.
7. O resultado é mostrado no navegador para aprovação antes do commit da implementação.
