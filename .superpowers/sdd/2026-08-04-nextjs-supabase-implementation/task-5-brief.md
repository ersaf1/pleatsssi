### Task 5: Midtrans Webhook Payment Status Handler

**Files:**
* Create: `src/app/api/webhooks/midtrans/route.ts`
* Create: `tests/webhook.test.ts`

**Interfaces:**
* Consumes: `supabaseServerClient` from Task 1.

- [ ] **Step 1: Write Webhook logic**
  
  Create `src/app/api/webhooks/midtrans/route.ts` checking signature and updating DB:
  ```typescript
  import { NextResponse } from 'next/server';
  import { supabaseServerClient } from '@/lib/supabaseServer';
  import crypto from 'crypto';

  export async function POST(request: Request) {
    const payload = await request.json();
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = payload;

    // Validate Signature Key
    const hash = crypto.createHash('sha512')
      .update(order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY)
      .digest('hex');

    if (hash !== signature_key) {
      return NextResponse.json({ success: false, message: 'Invalid Signature' }, { status: 403 });
    }

    const supabase = await supabaseServerClient();

    // Map Transaction Status
    let orderStatus = 'pending';
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      orderStatus = 'processing';
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      orderStatus = 'cancelled';
    }

    // Update order in DB
    const { error } = await supabase
      .from('orders')
      .update({ status: orderStatus })
      .eq('order_number', order_id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  }
  ```

- [ ] **Step 2: Write tests for webhook handler verification**
  
  Create `tests/webhook.test.ts`.

- [ ] **Step 3: Run tests and commit**
  
  Run: `npm run test`
  
  Expected: PASS
  
  Commit: `git add src/app/api/webhooks/midtrans/ tests/webhook.test.ts && git commit -m "feat: add midtrans webhook handler to update order statuses"`
