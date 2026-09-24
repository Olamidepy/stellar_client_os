import { NextRequest, NextResponse } from 'next/server';
import { CampaignPushNotificationService } from '@/services/campaign-push-notification.service';

const pushService = new CampaignPushNotificationService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscriberAddress, campaignId, endpoint, keys, deviceType, enabledMilestones } = body;

    if (!subscriberAddress || !endpoint || !keys) {
      return NextResponse.json(
        { error: 'subscriberAddress, endpoint, and keys are required' },
        { status: 400 }
      );
    }

    const subscription = await pushService.registerSubscription({
      subscriberAddress,
      campaignId,
      endpoint,
      keys,
      deviceType,
      enabledMilestones,
    });

    return NextResponse.json({ success: true, subscription }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to subscribe' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const endpointOrId = searchParams.get('endpoint') || searchParams.get('id');

    if (!endpointOrId) {
      return NextResponse.json(
        { error: 'endpoint or id query parameter is required' },
        { status: 400 }
      );
    }

    const removed = await pushService.unregisterSubscription(endpointOrId);
    if (!removed) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to unsubscribe' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    const all = await pushService.getSubscriptions();
    const filtered = address
      ? all.filter((s) => s.subscriberAddress.toLowerCase() === address.toLowerCase())
      : all;

    return NextResponse.json({ subscriptions: filtered });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to get subscriptions' }, { status: 500 });
  }
}
