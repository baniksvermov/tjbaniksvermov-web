import { Card, Badge } from 'tjbaniksvermov-web'
import { Newspaper } from 'lucide-react'

export function ArticleCard() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Card hoverable>
        <div
          style={{
            aspectRatio: '16/9',
            background: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
          }}
        >
          <Newspaper size={40} />
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <Badge>Novinky</Badge>
          </div>
          <h3 style={{ fontWeight: 700, margin: '0 0 6px', fontSize: 16, lineHeight: 1.3 }}>
            A-mužstvo zvítězilo 3:1 v nedělním derby
          </h3>
          <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>
            Skvělý výkon domácího týmu proti dlouholetému rivalovi rozhodl už v první půli.
          </p>
        </div>
      </Card>
    </div>
  )
}

export function Plain() {
  return (
    <div style={{ maxWidth: 280 }}>
      <Card>
        <div style={{ padding: 16 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#374151' }}>
            Jednoduchá karta bez hover efektu — pro statický obsah.
          </p>
        </div>
      </Card>
    </div>
  )
}
