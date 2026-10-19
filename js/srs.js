// Smart SRS (Spaced Repetition System SM-2+ with Cognitive Speed Weighting & Anti-Backlog)
class SRSSystem {
  constructor() {
    this.storageKey = 'autopilot_srs_records';
    this.maxDailyReviews = 20; // Anti-backlog cap
    this.records = this.loadRecords();
  }

  loadRecords() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.warn('Failed to load SRS records', e);
      return {};
    }
  }

  saveRecords() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.records));
    } catch (e) {
      console.warn('Failed to save SRS records', e);
    }
  }

  getRecord(itemId) {
    if (!this.records[itemId]) {
      this.records[itemId] = {
        itemId: itemId,
        reps: 0,
        interval: 1, // days
        easeFactor: 2.5,
        lastReviewed: null,
        nextReview: Date.now(),
        hesitationFlag: false,
        history: []
      };
    }
    return this.records[itemId];
  }

  /**
   * Rating: 1 = Hard, 2 = Good, 3 = Easy
   * telemetryData: { elapsedMs, classification, srsMultiplier }
   */
  processReview(itemId, rating, telemetryData = null) {
    const record = this.getRecord(itemId);
    const now = Date.now();

    let newInterval = 1;
    let newEase = record.easeFactor || 2.5;
    let hesitationFlag = false;

    // Base SM-2 Calculation
    if (rating === 1) { // Hard
      record.reps = 0;
      newInterval = 1;
      newEase = Math.max(1.3, newEase - 0.2);
    } else if (rating === 2) { // Good
      if (record.reps === 0) newInterval = 1;
      else if (record.reps === 1) newInterval = 3;
      else newInterval = Math.round(record.interval * newEase);
      record.reps += 1;
    } else if (rating === 3) { // Easy
      if (record.reps === 0) newInterval = 2;
      else if (record.reps === 1) newInterval = 5;
      else newInterval = Math.round(record.interval * (newEase + 0.15));
      record.reps += 1;
      newEase = Math.min(3.0, newEase + 0.15);
    }

    // Cognitive Telemetry Multiplier Override
    if (telemetryData) {
      if (telemetryData.classification === 'INSTANT_MASTERY') {
        // Instant speed (< 8s) -> double interval to save time
        newInterval = Math.max(2, Math.round(newInterval * 2.0));
        newEase = Math.min(3.2, newEase + 0.2);
      } else if (telemetryData.classification === 'SLOW_RECALL') {
        // Correct but slow (> 15s) -> force schedule in 2 days
        newInterval = 2;
        hesitationFlag = true;
      }
    }

    record.interval = newInterval;
    record.easeFactor = newEase;
    record.lastReviewed = now;
    record.nextReview = now + newInterval * 24 * 60 * 60 * 1000;
    record.hesitationFlag = hesitationFlag;
    record.history.push({
      time: now,
      rating,
      elapsedMs: telemetryData ? telemetryData.elapsedMs : null,
      classification: telemetryData ? telemetryData.classification : null
    });

    this.saveRecords();
    return record;
  }

  /**
   * Anti-backlog distribution: Caps daily cards to prevent overwhelm after days off
   */
  getDueItems(items) {
    const now = Date.now();
    const dues = items.filter(item => {
      const rec = this.records[item.id];
      if (!rec) return true; // new card is due
      return rec.nextReview <= now;
    });

    // Sort by most urgent/overdue first, cap at maxDailyReviews
    dues.sort((a, b) => {
      const recA = this.records[a.id];
      const recB = this.records[b.id];
      const timeA = recA ? recA.nextReview : 0;
      const timeB = recB ? recB.nextReview : 0;
      return timeA - timeB;
    });

    return dues.slice(0, this.maxDailyReviews);
  }

  getHesitantItems(items) {
    return items.filter(item => {
      const rec = this.records[item.id];
      return rec && rec.hesitationFlag;
    });
  }

  getStats() {
    const keys = Object.keys(this.records);
    let mastered = 0;
    let learning = 0;
    let hesitant = 0;

    keys.forEach(k => {
      const rec = this.records[k];
      if (rec.hesitationFlag) hesitant++;
      if (rec.reps >= 4 && rec.interval >= 10 && !rec.hesitationFlag) {
        mastered++;
      } else if (rec.reps > 0) {
        learning++;
      }
    });

    return {
      totalTracked: keys.length,
      mastered,
      learning,
      hesitant
    };
  }
}

window.srsSystem = new SRSSystem();
