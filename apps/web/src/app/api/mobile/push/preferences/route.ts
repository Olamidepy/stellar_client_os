import { NextRequest, NextResponse } from 'next/server';
import { CampaignPushNotificationService } from '@/services/campaign-push-notification.service';
import type { CampaignMilestoneType } from '@/types/campaign-notification';

const pushService = new CampaignPushNotificationService();

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscriberAddress, campaignId = '*', enabledMilestones } = body;

    if (!subscriberAddress || !Array.isArray(enabledMilestones)) {
      return NextResponse.json(
        { error: 'subscriberAddress and enabledMilestones array are required' },
        { status: 400 }
      );
    }

    const updated = await pushService.updatePreferences(
      subscriberAddress,
      campaignId,
      enabledMilestones as CampaignMilestoneType[]
    );

    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update preferences' }, { status: 500 });
  }
}
