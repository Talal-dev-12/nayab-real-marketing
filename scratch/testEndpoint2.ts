import { GET } from '../src/app/api/properties/route';
import { NextRequest } from 'next/server';

async function test() {
  const req = new NextRequest('http://localhost:3000/api/properties?dashboard=true&submittedBy=69e4d15bebf0f92244976afa&limit=200', {
    method: 'GET'
  });
  const res = await GET(req);
  const json = await res.json();
  console.log("Total properties returned:", json.properties.length);
  json.properties.forEach((p: any) => console.log(p.title, p.approvalStatus));
}

test().catch(console.error);
