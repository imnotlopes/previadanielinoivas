import { Link } from 'react-router-dom'

import Seo from '../components/Seo'

export default function NaoEncontrada() {
  return (
    <section className="container-luxo secao text-center">
      <Seo
        titulo="Página não encontrada"
        descricao="O endereço acessado não existe no site da Danielli Noivas."
        naoIndexar
      />

      <span className="eyebrow">Erro 404</span>
      <h1 className="mt-4 uppercase tracking-luxo">Página não encontrada</h1>
      <span className="filete mx-auto mt-6" />
      <p className="mx-auto mt-6 max-w-md text-preto/70">
        O endereço acessado não existe ou foi movido.
      </p>
      <Link to="/catalogo" className="btn-primario mt-10">
        Ver o catálogo
      </Link>
    </section>
  )
}
