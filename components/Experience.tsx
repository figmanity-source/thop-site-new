"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import { buildSceneTimeline } from "@/lib/sceneTimeline";
import { healthspan, twin } from "@/lib/content";
import { getLenis } from "@/lib/lenis";
import { WhatsAppFloat } from "./SiteFooter";
import Loader from "./Loader";
import Header from "./Header";
import Cursor from "./Cursor";
import TransitionOverlay from "./TransitionOverlay";
import Intro from "./sections/Intro";
import BigText from "./sections/BigText";
import VerticalText from "./sections/VerticalText";
import Disassembly from "./sections/Disassembly";
import Mechanism from "./sections/Mechanism";
import SinglePart from "./sections/SinglePart";
import MovementRight from "./sections/MovementRight";
import Straps from "./sections/Straps";
import Images from "./sections/Images";
import Colors from "./sections/Colors";
import Parts from "./sections/Parts";
import Biology from "./sections/Biology";
import Founder from "./sections/Founder";
import Team from "./sections/Team";
import Faq from "./sections/Faq";
import Footer from "./sections/Footer";
import { EnquiryProvider, useEnquiry } from "./Enquiry";
import { dox, cellution } from "@/lib/content";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

function TwinCta() {
  const openEnquiry = useEnquiry();
  return <button className="pill bioblueprint-cta" type="button" onClick={() => openEnquiry("BIOBLUEPRINT")}>{twin.cta}</button>;
}

export default function Experience() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();

    let killScene: (() => void) | null = null;
    const build = () => {
      killScene?.();
      ScrollTrigger.refresh();
      killScene = buildSceneTimeline();
    };
    window.addEventListener("thop:ready", build, { once: true });
    const onIntro = () => {
      const hash = window.location.hash;
      const dest = hash ? document.querySelector(hash) : null;
      if (dest) window.setTimeout(() => getLenis()?.scrollTo(dest, { force: true }), 700);
    };
    window.addEventListener("thop:intro", onIntro, { once: true });
    let rt = 0;
    const onResize = () => { window.clearTimeout(rt); rt = window.setTimeout(build, 250); };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("thop:intro", onIntro);
      killScene?.();
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <>
      <Loader />
      <Scene />
      <EnquiryProvider>
      <Header />
      <WhatsAppFloat />
      <Cursor />
      <TransitionOverlay />
      <div id="the-watch">
        <Intro />
        <BigText
          section="Timeless"
          id="healthspan"
          title={healthspan.big.title}
          lines={healthspan.big.lines}
          info={[
            { caption: "", title: <><b>{healthspan.title[0]}</b><br /><b>{healthspan.title[1]}</b></> },
            { caption: healthspan.labels.join(" · "), title: healthspan.body },
          ]}
        />
        <VerticalText />
        <Disassembly />
        <Mechanism />
        <BigText
          section="Movement"
          id="twin"
          dark
          title={twin.big.title}
          lines={twin.big.lines}
          info={[
            {
              caption: "Your dashboard",
              title: <><b>{twin.title}</b><br /><br />{twin.dashboard}<br /><br /><b>Your Twin</b><br />{twin.twin}</>,
            },
            {
              caption: "Your Reveal",
              title: (
                <>
                  {twin.reveal}
                  <p className="muted">{twin.sample}</p>
                  <TwinCta />
                </>
              ),
            },
          ]}
        />
        <SinglePart section="Curves" id="dox" pretitle={dox.eyebrow} title={dox.title} text={dox.body} />
        <MovementRight />
        <SinglePart
          section="Hands"
          id="cellution"
          pretitle={cellution.eyebrow}
          title={cellution.title}
          text={cellution.body}
          extra={(
            <div className="sp-extra sp-copy">
              {cellution.parts.map((part) => (
                <p key={part.label}><b>{part.label}</b> {part.text}</p>
              ))}
              {cellution.rules.map((rule) => (
                <p key={rule.label}><b>{rule.label}</b> {rule.text}</p>
              ))}
              <p><b>Who it’s for</b> {cellution.who}</p>
            </div>
          )}
        />
        <Straps />
        <Images />
        <Colors />
        <Biology />
        <Founder />
        <Team />
        <Parts />
        <Faq />
        <div style={{ height: "80vh" }}></div>
        <Footer />
      </div>
      </EnquiryProvider>
    </>
  );
}
