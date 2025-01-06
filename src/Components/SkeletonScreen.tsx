import { PropsWithChildren } from "react";

function SkeletonScreen() {
  return (
    <>
      <div className="grid">
        <div className="s6">
          <SkeletonCard>
            <h4>
              <span>&nbsp;</span>
            </h4>
          </SkeletonCard>
        </div>
        <div className="s4"></div>
        <div className="s2 right-align">
          <SkeletonCard>
            <h4>
              <span>&nbsp;</span>
            </h4>
          </SkeletonCard>
        </div>
      </div>
      <div className="grid">
        <div className="s3">
          <SkeletonCard>
            <h1>
              <span>&nbsp;</span>
            </h1>
            <h1>
              <span>&nbsp;</span>
            </h1>
          </SkeletonCard>
        </div>
        <div className="s8"></div>
        <div className="s1 right-align">
          <SkeletonCard>
            <h4>
              <span>&nbsp;</span>
            </h4>
          </SkeletonCard>
          <SkeletonCard>
            <progress className="max" />
            <span>&nbsp;</span>
          </SkeletonCard>
        </div>
      </div>
      <div className="grid">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
          <>
            {number === 7 ? <div className="l l4"></div> : <></>}
            <div className="s12 m6 l2">
              <SkeletonCard>
                <h1>&nbsp;</h1>
                <h2>&nbsp;</h2>
                <progress className="max" />
              </SkeletonCard>
            </div>
            {number === 8 ? <div className="l l4"></div> : <></>}
          </>
        ))}
      </div>
    </>
  );
}

function SkeletonCard({ children }: PropsWithChildren) {
  return (
    <article style={{ boxShadow: "none" }} className="max">
      <progress className="max" />
      {children}
    </article>
  );
}

export default SkeletonScreen;
