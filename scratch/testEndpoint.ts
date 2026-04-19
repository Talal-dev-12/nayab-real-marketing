import { GET } from '../src/app/api/properties/route';
import { NextRequest } from 'next/server';

async function test() {
  const req = new NextRequest('http://localhost:3000/api/properties?dashboard=true&submittedBy=69e4d15bebf0f92244976afa&approvalStatus=pending&page=1&limit=8', {
    method: 'GET'
  });
  const res = await GET(req);
  const json = await res.json();
  console.log("Response:", JSON.stringify(json, null, 2));
}

test().catch(console.error);
