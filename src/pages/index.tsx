import { Inter } from "next/font/google";
import kebabCase from "lodash.kebabcase";
import Head from "next/head";
import { useRouter } from "next/router";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";

import { clsx } from "../utils";

const inter = Inter({ subsets: ["latin"] });

// TODO - create 404 page, make look more snazzy
export default function Home() {
  const { push } = useRouter();

  return (
    <>
      <Head>
        <title>MP Scorecard</title>
        <meta
          name='description'
          content='Find out how your MP voted over the last Parliament.'
        />
        <meta property='og:title' content='MP Scorecard' />
        <meta
          property='og:description'
          content='Find out how your MP voted over the last Parliament.'
        />
        <meta
          property='og:image'
          content='https://mpscorecard.uk/opengraph-image.jpg'
        />
      </Head>
      <main
        className={clsx(
          "flex-col min-h-screen min-w-full px-6 lg:px-16 content-center bg-gradient-to-br from-yellow-100 via-red-200 to-blue-300",
          inter.className
        )}>
        <div className='mx-auto'>
          <h1 className='max-w-2xl mb-4 text-3xl font-extrabold text-gray-800 uppercase sm:text-6xl'>
            How did your MP vote over the last Parliament?
          </h1>
          <h2 className='max-w-xl mb-8 text-xl font-bold text-gray-600 uppercase sm:text-4xl'>
            Enter your postcode to see their scorecard.
          </h2>
        </div>

        <div>
          <Formik
            initialValues={{
              postcode: "",
            }}
            validationSchema={yup.object().shape({
              postcode: yup
                .string()
                .trim()
                .required("Please enter a postcode.")
                .matches(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, {
                  message: "That postcode doesn't look valid!",
                })
                .notOneOf(
                  ["SANTA1", "SAN TA1"],
                  "Ho ho ho! Santa doesn't have an MP! 🎅🏼"
                ),
            })}
            onSubmit={async (values, { setErrors }) => {
              const { postcode } = values;

              const find = `https://api.postcodes.io/postcodes/${encodeURIComponent(
                postcode
              )}`;

              const response = await fetch(find);

              try {
                const {
                  result: { parliamentary_constituency },
                } = (await response.json()) as {
                  result: {
                    parliamentary_constituency: string;
                  };
                };

                await push(
                  `/constituency/${kebabCase(parliamentary_constituency)}`
                );
              } catch {
                setErrors({
                  postcode:
                    "We couldn't find that postcode. Please try another one!",
                });
              }
            }}>
            {({ touched, errors, submitCount }) => (
              <Form>
                <label
                  htmlFor='postcode'
                  className='font-light text-gray-700 uppercase text-md sm:text-2xl'>
                  Your postcode
                </label>
                <div className='flex mt-2'>
                  <Field
                    required
                    id='postcode'
                    name='postcode'
                    placeholder='SW1A 2AA'
                    className='px-2 border border-gray-300 md:px-4 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <button
                    type='submit'
                    className='h-full px-3 py-3 text-sm font-bold text-white bg-red-600 md:text-base md:px-4 rounded-r-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'>
                    Submit
                  </button>
                </div>
                {touched.postcode && errors.postcode && submitCount >= 1 && (
                  <p className='mt-2 text-sm text-red-600'>{errors.postcode}</p>
                )}
              </Form>
            )}
          </Formik>
          <p className='mt-2 font-extralight font-gray-200'>
            This website uses data from{" "}
            <a href='https://theyworkforyou.com' className='underline'>
              TheyWorkForYou
            </a>
            ,{" "}
            <a href='https://developer.parliament.uk' className='underline'>
              the UK Parliament API
            </a>{" "}
            and{" "}
            <a href='https://postcodes.io' className='underline'>
              Postcodes.io
            </a>
            .
          </p>
        </div>
      </main>
    </>
  );
}
