import Login from "@/components/forms/userInfo/login";
import styles from "./page.module.css" with { type: "css" };
import AttributedImage from "@/components/generic/images/attributedImage";

export default async function Page() {
  return (
    <>
      <main className={`${styles.gridLayout} container margin-auto padding-y-500 grid gap-300 align-items-center`}>
        <Login />
        <div className={`${styles.image} position-relative width-100 rounded overflow-hidden`}>
          <AttributedImage src="/images/windturbines.jpg" alt="">
            <div className="width-100 padding-100">
              Photo by <a className="color-purewhite" href="https://unsplash.com/@nrdoherty?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" target="_blank">Nicholas Doherty</a> on <a className="color-purewhite" href="https://unsplash.com/photos/white-electic-windmill-pONBhDyOFoM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" target="_blank">Unsplash</a>
            </div>
          </AttributedImage>
        </div>
      </main>
    </>
  )
}