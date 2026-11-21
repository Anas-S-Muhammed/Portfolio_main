const sqlWords = /\b(select|from|where|group|by|order|join|left|right|inner|outer|on|and|or|as|with|case|when|then|else|end|limit|count|sum|avg|over|partition|distinct|insert|into|values|create|table|view|having)\b/gi
const pythonWords = /\b(def|return|import|from|as|for|in|if|elif|else|with|class|lambda|None|True|False|and|or|not|try|except|yield|async|await)\b/g

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function CodeSnippet({ code, language, caption }: { code: string; language: string; caption?: string | null }) {
  const pattern = language === 'python' ? pythonWords : language === 'text' ? null : sqlWords
  const html = pattern ? escapeHtml(code).replace(pattern, '<span class="token">$&</span>') : escapeHtml(code)

  return (
    <figure className="code-snippet">
      <figcaption className="mono-label">{language === 'text' ? 'Snippet' : language}</figcaption>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      {caption ? <p>{caption}</p> : null}
    </figure>
  )
}
