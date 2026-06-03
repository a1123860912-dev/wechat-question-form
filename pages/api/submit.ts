import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: '仅支持 POST 请求' })
  }

  const { name, contact, description } = req.body || {}

  if (!contact || typeof contact !== 'string' || !contact.trim()) {
    return res.status(400).json({ error: '联系方式不能为空' })
  }
  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ error: '困境描述不能为空' })
  }
  if (contact.length > 100) {
    return res.status(400).json({ error: '联系方式过长' })
  }
  if (description.length > 3000) {
    return res.status(400).json({ error: '描述内容过长（最多3000字）' })
  }

  const webhookUrl = process.env.FEISHU_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('FEISHU_WEBHOOK_URL 未配置')
    return res.status(500).json({ error: '服务未配置，请稍后重试' })
  }

  try {
    const timestamp = new Date().toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const message = {
      msg_type: 'post',
      content: {
        post: {
          zh_cn: {
            title: `新的读者提问 · ${timestamp}`,
            content: [
              [
                { tag: 'text', text: '称呼：', style: { bold: true } },
                { tag: 'text', text: name?.trim() || '未填写' }
              ],
              [
                { tag: 'text', text: '联系方式：', style: { bold: true } },
                { tag: 'text', text: contact.trim() }
              ],
              [{ tag: 'text', text: '' }],
              [
                { tag: 'text', text: '困境描述：', style: { bold: true } }
              ],
              [{ tag: 'text', text: description.trim() }]
            ]
          }
        }
      }
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'unknown')
      console.error('飞书 API 错误:', response.status, errorText)
      return res.status(502).json({ error: '通知发送失败，请稍后重试' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('提交处理错误:', err)
    return res.status(500).json({ error: '服务器内部错误' })
  }
}
