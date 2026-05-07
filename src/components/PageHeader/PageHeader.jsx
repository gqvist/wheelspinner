import './PageHeader.css'

function PageHeader({ title }) {
  return (
    <header className="page-header">
      <h1 className="page-header__title">{title}</h1>
      <p className="page-header__subtitle">
        För att Martz ska få dricka en öl behöver han göra följande utmaning...
      </p>
    </header>
  )
}

export default PageHeader
