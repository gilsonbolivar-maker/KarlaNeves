# Karla Neves · Acompanhamento de influencers

- **Painel da Karla:** https://gilsonbolivar-maker.github.io/KarlaNeves/ (entra com e-mail e senha)
- **Página de cada cliente:** `cliente.html#TOKEN` (link individual, gerado no painel)
- **Legendas (para as clientes gravarem):** `legendas/`

## Como funciona
1. A Karla cadastra a cliente. Cada cliente recebe um link próprio e secreto.
2. A Karla cria atividades (vídeo, post, tarefa) com roteiro, legenda, links e prazo, e lembretes.
3. A cliente abre a página dela, vê só o que é dela, grava no Legendas (o roteiro abre no teleprompter) e marca "gravei" / "postei".
4. O painel da Karla mostra o andamento de todas.

## Técnico
- Banco: Supabase, projeto `karla-neves` (sa-east-1). Tabelas com RLS por dono; a cliente acessa só pelas funções `portal`, `portal_atividade` e `portal_lembrete`, com o token.
- Biblioteca do Supabase em `vendor/` (sem depender de CDN).
- Projeto gratuito do Supabase pausa depois de 7 dias sem uso.
