import { useState } from 'react'

export default function Home() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contact.trim() || !description.trim()) {
      setErrorMsg('请填写联系方式和困境描述')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, description })
      })

      if (res.ok) {
        setStatus('success')
        setName('')
        setContact('')
        setDescription('')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || '提交失败，请稍后重试')
        setStatus('error')
      }
    } catch {
      setErrorMsg('网络错误，请检查网络后重试')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="container">
        <div className="card">
          <div className="success-icon">&#10003;</div>
          <h1>已收到</h1>
          <p className="subtitle">谢谢你愿意分享。<br />我会认真阅读的。</p>
          <button onClick={() => setStatus('idle')} className="btn-secondary">
            再写一条
          </button>
        </div>
        <style jsx>{`
          .success-icon {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #C17F59;
            color: #fff;
            font-size: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
          }
        `}</style>
        <CommonStyles />
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div className="hero">
          <p className="lead">
            很多时候，问题不在于没有答案。<br />
            而在于我们还没有看清自己所处的环境。
          </p>
          <div className="divider" />
          <p className="subtitle">
            如果你愿意，告诉我你的困境。
          </p>
          <p className="promise">
            我会认真阅读每一份留言，并尽可能通过文章或私信的方式回应大家关心的问题。
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>怎么称呼你<span className="optional">（选填）</span></label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="昵称或名字"
            />
          </div>

          <div className="field">
            <label>联系方式<span className="required">*</span></label>
            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="微信 / 手机号"
            />
          </div>

          <div className="field">
            <label>你的困境描述<span className="required">*</span></label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="发生了什么？你现在的感受是什么？"
              rows={6}
            />
          </div>

          {errorMsg && <div className="error">{errorMsg}</div>}

          <button type="submit" disabled={status === 'loading'} className="btn">
            {status === 'loading' ? '发送中...' : '发送'}
          </button>
        </form>

        <p className="privacy">
          你的故事不会被公开分享，仅用于回复。
        </p>
      </div>
      <CommonStyles />
    </div>
  )
}

function CommonStyles() {
  return (
    <style jsx global>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          "Helvetica Neue", Arial, "Noto Sans SC", "PingFang SC",
          "Microsoft YaHei", sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px 16px;
        background: #FAF7F2;
      }
      .card {
        width: 100%;
        max-width: 480px;
        background: #FFFFFF;
        border-radius: 16px;
        padding: 40px 28px;
        box-shadow: 0 4px 24px rgba(45, 41, 38, 0.06);
      }
      .hero {
        text-align: center;
        margin-bottom: 36px;
        padding-top: 4px;
      }
      .lead {
        font-size: 16px;
        color: #3D3833;
        line-height: 1.9;
        font-weight: 400;
        margin-bottom: 20px;
        letter-spacing: 0.01em;
      }
      .divider {
        width: 32px;
        height: 1px;
        background: #C17F59;
        opacity: 0.4;
        margin: 0 auto 16px;
      }
      .subtitle {
        font-size: 15px;
        color: #2D2926;
        line-height: 1.8;
        text-align: center;
        font-weight: 500;
        letter-spacing: 0.04em;
        margin-bottom: 12px;
      }
      .promise {
        font-size: 13px;
        color: #9C9088;
        line-height: 1.7;
        text-align: center;
        font-weight: 400;
        letter-spacing: 0.01em;
      }
      .field {
        margin-bottom: 24px;
      }
      label {
        display: block;
        font-size: 14px;
        color: #2D2926;
        margin-bottom: 8px;
        font-weight: 500;
      }
      .required {
        color: #C17F59;
        margin-left: 4px;
      }
      .optional {
        color: #B5ADA4;
        font-weight: 400;
        margin-left: 4px;
      }
      input,
      textarea {
        width: 100%;
        padding: 13px 16px;
        border: 1px solid #E8E0D8;
        border-radius: 10px;
        font-size: 15px;
        color: #2D2926;
        background: #FDFCFB;
        transition: all 0.2s;
        font-family: inherit;
        line-height: 1.6;
      }
      input::placeholder,
      textarea::placeholder {
        color: #C4BDB4;
      }
      input:focus,
      textarea:focus {
        outline: none;
        border-color: #C17F59;
        background: #FFFFFF;
        box-shadow: 0 0 0 3px rgba(193, 127, 89, 0.08);
      }
      textarea {
        resize: vertical;
        line-height: 1.8;
      }
      .error {
        color: #A94B4B;
        font-size: 14px;
        margin-bottom: 16px;
        padding: 10px 14px;
        background: #FDF2F2;
        border-radius: 8px;
        border: 1px solid #F5D5D5;
      }
      .btn {
        width: 100%;
        padding: 15px;
        background: #C17F59;
        color: #FFFFFF;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        letter-spacing: 0.02em;
      }
      .btn:hover:not(:disabled) {
        background: #A86B48;
      }
      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .btn-secondary {
        width: 100%;
        padding: 14px;
        background: transparent;
        color: #C17F59;
        border: 1px solid #C17F59;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        margin-top: 20px;
        transition: all 0.2s;
      }
      .btn-secondary:hover {
        background: rgba(193, 127, 89, 0.04);
      }
      .privacy {
        font-size: 12px;
        color: #B5ADA4;
        text-align: center;
        margin-top: 20px;
        line-height: 1.5;
      }
      @media (max-width: 480px) {
        .card {
          padding: 36px 22px;
          border-radius: 12px;
        }
        .hero {
          margin-bottom: 32px;
        }
        .lead {
          font-size: 15px;
        }
      }
    `}</style>
  )
}
