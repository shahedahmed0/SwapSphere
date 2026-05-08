import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../config/api';

const Stats = () => {
  const [platformStats, setPlatformStats] = useState({
    activeCollectors: 0,
    successfulSwaps: 0,
    itemsListed: 0,
    hobbyNiches: 0
  });

  useEffect(() => {
    if (window.PureCounter) {
      new window.PureCounter();
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await axios.get(apiUrl('/api/stats'));
        if (!mounted) return;
        setPlatformStats({
          activeCollectors: res.data?.activeCollectors || 0,
          successfulSwaps: res.data?.successfulSwaps || 0,
          itemsListed: res.data?.itemsListed || 0,
          hobbyNiches: res.data?.hobbyNiches || 0
        });
        if (window.PureCounter) {
          new window.PureCounter();
        }
      } catch (e) {
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="stats" className="stats section light-background">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-4">
          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span
                data-purecounter-start="0"
                data-purecounter-end={platformStats.activeCollectors}
                data-purecounter-duration="1"
                className="purecounter"
              >
                {platformStats.activeCollectors}
              </span>
              <p>Active Collectors</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span
                data-purecounter-start="0"
                data-purecounter-end={platformStats.successfulSwaps}
                data-purecounter-duration="1"
                className="purecounter"
              >
                {platformStats.successfulSwaps}
              </span>
              <p>Successful Swaps</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span
                data-purecounter-start="0"
                data-purecounter-end={platformStats.itemsListed}
                data-purecounter-duration="1"
                className="purecounter"
              >
                {platformStats.itemsListed}
              </span>
              <p>Items Listed</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="stats-item text-center w-100 h-100">
              <span
                data-purecounter-start="0"
                data-purecounter-end={platformStats.hobbyNiches}
                data-purecounter-duration="1"
                className="purecounter"
              >
                {platformStats.hobbyNiches}
              </span>
              <p>Hobby Niches</p>
            </div>
          </div>

        </div>
      </div>
    </section>);

};

export default Stats;
